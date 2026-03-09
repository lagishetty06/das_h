const { generateText, generateStructuredText } = require('../services/aiService');
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const { sendEmail } = require('../services/emailService');
const mongoose = require('mongoose');

// --- Helper: Extracts JSON from AI response ---
const extractJson = (text) => {
    if (!text || typeof text !== 'string') { console.error("Invalid input to extractJson:", text); return null; }
    const match = text.match(/```json\s*([\s\S]*?)\s*```|({[\s\S]*})/);
    if (match) {
        const jsonString = match[1] || match[2];
        try { return JSON.parse(jsonString); } catch (e) { console.error("Failed to parse extracted JSON string:", jsonString, e); return null; }
    }
    console.error("No JSON object pattern found in AI response:", text); return null;
};

// --- Helper: Sends creation email ---
const sendCreationEmail = async (userId, task) => {
    const user = await User.findById(userId);
    if (user) {
        let detailsHtml = '';
        const dateTimeOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' };
        if (task.dueDate) { detailsHtml += `<br><b>🎯 Deadline:</b> ${new Date(task.dueDate).toLocaleString('en-US', dateTimeOptions)}`; }
        if (task.alarms && task.alarms.length > 0) {
            const nextAlarmTime = new Date(Math.min(...task.alarms.map(alarm => new Date(alarm.time))));
            detailsHtml += `<br><b>⏰ First Reminder:</b> ${nextAlarmTime.toLocaleString('en-US', dateTimeOptions)}`;
        }
        const emailSubject = `🚀 New Quest Added (by AI): ${task.title}`;
        const emailBody = `Hi ${user.name},<br><br>Your assistant has created a new task: "<strong>${task.title}</strong>". Details:${detailsHtml}<br><br>You've got this!`;
        await sendEmail(user.email, emailSubject, emailBody);
    }
};

// --- Helper: Generates alarms from a due date ---
const generateAlarmsAndDueDate = (taskDetails) => {
    let finalAlarms = [];
    let validDueDate = null;
    let isDailyRecurrence = (taskDetails.recurrence && taskDetails.recurrence.toLowerCase() === 'daily') || (taskDetails.isRecurrentDaily === true);
    if (taskDetails.dueDate && !isNaN(new Date(taskDetails.dueDate))) {
        validDueDate = new Date(taskDetails.dueDate);
        const dueDateMillis = validDueDate.getTime();
        const reminder10Min = new Date(dueDateMillis - 10 * 60 * 1000);
        const reminder5Min = new Date(dueDateMillis - 5 * 60 * 1000);
        const now = new Date();
        if (reminder10Min > now) finalAlarms.push({ time: reminder10Min, repeatDaily: isDailyRecurrence });
        if (reminder5Min > now) finalAlarms.push({ time: reminder5Min, repeatDaily: isDailyRecurrence });
        if (isDailyRecurrence && finalAlarms.length === 0 && validDueDate > now) { finalAlarms.push({ time: validDueDate, repeatDaily: true }); }
    }
    if (taskDetails.alarms && Array.isArray(taskDetails.alarms)) { taskDetails.alarms.forEach(a => { const alarmDate = new Date(a); if (!isNaN(alarmDate)) { if (!finalAlarms.some(existing => existing.time.getTime() === alarmDate.getTime())) { finalAlarms.push({ time: alarmDate, repeatDaily: isDailyRecurrence }); } } }); }
    return { finalAlarms, validDueDate, isDailyRecurrence };
};


// --- Feature 1: AI Help Assistant (IMPROVED CONTEXT) ---
exports.askAboutDash = async (req, res) => {
    console.log('=== askAboutDash called ===');
    console.log('Request body:', req.body);

    // Accept either `question` (legacy) or `textInput` (from /command -> HELP)
    let { question, textInput } = req.body || {};
    let userQuestion = (typeof question === 'string' && question.trim())
        ? question.trim()
        : (typeof textInput === 'string' ? textInput.trim() : '');

    if (!userQuestion) {
        console.log('ERROR: No question/textInput provided');
        return res.status(400).json({ message: 'Question is required.' });
    }

    console.log('Question received:', userQuestion);

    // Fast-path: respond to simple greetings without calling the LLM
    const greetingRegex = /^(hi+|hello|hey+|yo+|hola|sup|hlo+)\b/i;
    if (greetingRegex.test(userQuestion)) {
        return res.json({
            answer: [
                'Hi! I\'m your DASH assistant. I can help you manage tasks, answer questions, and navigate the app.',
                'Try these:',
                '- Create or update tasks',
                '- See what\'s overdue or due today',
                '- View your calendar and notifications',
                '',
                'Open [All Tasks](/tasks), check your [Starred Tasks](/tasks/starred), or view the [Calendar](/tasks/calendar).'
            ].join('\n')
        });
    }

    const context = `
        You are DASH (Decisive Assistant for Scheduling), a helpful AI assistant for a task management app.
        Your goal is to answer user questions about how to use the app in a friendly, professional manner.

        CRITICAL SCOPE RULE:
        - You can ONLY answer questions about DASH app features, task management, navigation, and app functionality.
        - If the user asks about politics, science, general knowledge, weather, news, or anything NOT related to DASH:
          Respond EXACTLY: "I can only help with DASH app features like task management, navigation, and app functionality. Please ask about creating tasks, setting reminders, viewing your calendar, or any other DASH features!"
        - DO NOT attempt to answer out-of-scope questions even partially.

        RESPONSE FORMAT RULES:
        1. Use simple, clear, conversational language. Be friendly and professional.
        2. Use bullet points (-) or numbered lists (1., 2., 3.) for steps or feature lists.
        3. DO NOT use Markdown bold/italic syntax (**text**, *text*). Use plain text only.
        4. When mentioning app pages or features, format them as clickable links:
           - Format: [Link Text](/url/path)
           - Examples: "Check your [All Tasks](/tasks) page", "View the [Calendar](/tasks/calendar)", "See your [Profile](/profile)"
        5. After providing information, suggest relevant navigation links.
        6. CRITICAL PRIVACY: Never provide developer contact info unless user asks "How do I contact the developer?" or similar.

        COMPREHENSIVE DASH FEATURES:

        PAGES & NAVIGATION:
        - [All Tasks](/tasks): Your main task hub. Create new tasks, edit existing ones, mark tasks complete, star important ones, or delete tasks.
        - [Starred Tasks](/tasks/starred): Quick access to your most important tasks. Star any task to see it here.
        - [Completed Tasks](/tasks/completed): Archive of all finished tasks. Review your accomplishments!
        - [Trash](/tasks/trash): Deleted tasks land here. Recover tasks or permanently delete them. Overdue tasks automatically move here.
        - [Calendar](/tasks/calendar): Visual calendar view showing all your tasks by date. Great for planning ahead.
        - [Notifications](/tasks/notifications): History of all reminders sent to you (email/SMS). Track your reminder activity.
        - [Profile](/profile): Update your name, phone number, and password. View task statistics and analytics.

        TASK MANAGEMENT FEATURES:
        - Creating Tasks: Click "Add Task" button, enter title (required), optional description, set due date/time, set priority (0-100%), add reminders.
        - Editing Tasks: Click any task to open details, click "Edit" button, modify any field, save changes.
        - Completing Tasks: Click the checkmark icon on any task. Completed tasks move to [Completed Tasks](/tasks/completed).
        - Starring Tasks: Click the star icon to mark tasks as important. View all starred tasks on [Starred Tasks](/tasks/starred).
        - Deleting Tasks: Click the trash icon. Deleted tasks go to [Trash](/tasks/trash) for 30 days before permanent deletion.
        - Priority System: Slider from 0-100%. Higher values = more important. Use 80-100 for urgent tasks.
        - Due Dates: Set specific date and time for any task. Tasks appear on [Calendar](/tasks/calendar) on their due date.
        - Reminders/Alarms: Add multiple reminders per task. Choose specific times. Option for daily recurring reminders.
        - Auto-Cleanup: Tasks overdue by 7+ days automatically move to [Trash](/tasks/trash) to keep your list clean.

        REMINDER SYSTEM:
        - Email & SMS Notifications: Receive reminders via email and optionally SMS (if phone number provided in [Profile](/profile)).
        - Multiple Reminders: Set as many reminders as you need for one task (e.g., 1 hour before, 10 minutes before).
        - Recurring Daily Reminders: Option to make reminders repeat every day at the same time.
        - Reminder History: View all past reminders on [Notifications](/tasks/notifications).

        COMMON QUESTIONS & ANSWERS:
        Q: How do I create a task?
        A: Go to [All Tasks](/tasks), click the "Add Task" button, fill in the title (required), add optional details like description, due date, priority, and reminders, then click "Create Task".

        Q: How do I set a reminder?
        A: When creating or editing a task, click "Add Reminder", select the date and time, optionally check "Repeat Daily", then save.

        Q: Where do completed tasks go?
        A: Completed tasks move to [Completed Tasks](/tasks/completed). You can still view, restore, or permanently delete them from there.

        Q: What happens to overdue tasks?
        A: Tasks that are overdue by 7 or more days automatically move to [Trash](/tasks/trash). You can recover them from there if needed.

        Q: How do I star a task?
        A: Click the star icon next to any task to mark it as important. View all starred tasks on [Starred Tasks](/tasks/starred).

        Q: Can I change my password?
        A: Yes! Go to [Profile](/profile), scroll to "Change Password" section, enter current and new password, then save.

        Q: How do I view my task statistics?
        A: Visit your [Profile](/profile) page to see total tasks, completed tasks, pending tasks, starred tasks, and more.

        Q: What's the Calendar view?
        A: The [Calendar](/tasks/calendar) page shows all your tasks visually organized by their due dates. Great for planning your week/month.

        ANSWERING STYLE:
        - Be concise but complete. Don't over-explain simple questions.
        - Use natural, conversational tone. Avoid robotic language.
        - Always suggest relevant navigation links after answering.
        - If unsure what the user needs, ask clarifying questions or suggest multiple relevant pages.
        - Example good answer: "You can create a task by going to [All Tasks](/tasks) and clicking the 'Add Task' button. Fill in the title, set a due date, and add any reminders you need!"
    `;
    const prompt = `${context}\n\nUser Question: "${userQuestion}"\n\nYour Answer:`;
    try {
        const answer = await generateText(prompt);
        res.json({ answer });
    } catch (error) {
        console.error("Error getting answer from AI:", error);
        // Provide a safe fallback so the chat never feels broken
        return res.status(200).json({
            answer: [
                'I had trouble reaching the AI service just now. Here are some things I can help with:',
                '- Create a new task with a title, due date, priority, and reminders',
                '- Show what\'s overdue or due today',
                '- Open your calendar or completed tasks',
                '',
                'You can navigate to [All Tasks](/tasks), [Starred Tasks](/tasks/starred), [Completed Tasks](/tasks/completed), or [Calendar](/tasks/calendar).'
            ].join('\n')
        });
    }
};

// --- Handler for CREATE Intent ---
async function handleCreateTask(userId, textInput) {
    const taskSchema = {
        type: "OBJECT",
        properties: {
            title: { type: "STRING" }, description: { type: "STRING", nullable: true },
            dueDate: { type: "STRING", description: "ISO 8601 format", nullable: true },
            priority: { type: "NUMBER", nullable: true },
            alarms: { type: "ARRAY", items: { type: "STRING" }, nullable: true },
            recurrence: { type: "STRING", nullable: true }, isRecurrentDaily: { type: "BOOLEAN", nullable: true }
        },
    };
    const prompt = `
        Analyze this user input to create a task. Extract title, description, dueDate (ISO 8601), priority (0-100), and recurrence ('daily').
        CRITICAL: The user is in 'Asia/Kolkata' (IST, UTC+5:30) timezone. All relative times ('tomorrow', '10pm') MUST be interpreted in this timezone.
        Today's date is ${new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })}.
        Return ONLY the JSON object.
        User Input: "${textInput}"
    `;
    const rawResponse = await generateStructuredText(prompt, taskSchema);
    const taskDetails = extractJson(rawResponse);
    if (!taskDetails) { throw new Error('AI returned invalid JSON for task creation.'); }

    const extractedTitle = taskDetails.title || taskDetails.task_description || taskDetails.taskDescription || taskDetails.description;
    const extractedDescription = (taskDetails.title && extractedTitle === taskDetails.description) ? '' : taskDetails.description;
    if (!extractedTitle) { throw new Error("AI failed to extract a valid task identifier."); }

    let { finalAlarms, validDueDate } = generateAlarmsAndDueDate(taskDetails);
    const newTask = new Task({ user: userId, title: extractedTitle, description: extractedDescription || '', priority: taskDetails.priority || 50, dueDate: validDueDate, alarms: finalAlarms });
    const savedTask = await newTask.save();
    await sendCreationEmail(userId, savedTask);
    return { message: `Task created: "${savedTask.title}"`, task: savedTask };
}

// --- Handler for READ Intent ---
async function handleReadTasks(userId, textInput) {
    const userTasks = await Task.find({ user: userId, isDeleted: false }).select('title description priority dueDate isCompleted isStarred');
    
    // Calculate analytics
    const totalTasks = userTasks.length;
    const completedTasks = userTasks.filter(t => t.isCompleted).length;
    const pendingTasks = totalTasks - completedTasks;
    const starredTasks = userTasks.filter(t => t.isStarred && !t.isCompleted).length;
    const now = new Date();
    const overdueTasks = userTasks.filter(t => !t.isCompleted && t.dueDate && new Date(t.dueDate) < now).length;
    const todayTasks = userTasks.filter(t => {
        if (!t.dueDate || t.isCompleted) return false;
        const taskDate = new Date(t.dueDate);
        return taskDate.toDateString() === now.toDateString();
    }).length;
    
    const taskListForAI = userTasks
        .filter(t => !t.isCompleted)
        .map(t => ({
            title: t.title,
            priority: t.priority,
            dueDate: t.dueDate,
            isStarred: t.isStarred
        }));
    
    const readPrompt = `
        You are a helpful assistant analyzing a user's task list.
        
        User Query: "${textInput}"
        
        TASK STATISTICS:
        - Total Tasks: ${totalTasks}
        - Pending: ${pendingTasks}
        - Completed: ${completedTasks}
        - Starred: ${starredTasks}
        - Overdue: ${overdueTasks}
        - Due Today: ${todayTasks}
        
        ACTIVE TASKS (Not Completed):
        ${JSON.stringify(taskListForAI, null, 2)}
        
        INSTRUCTIONS:
        1. Analyze the query and provide relevant information
        2. If asking for "tasks today" or "overdue", highlight those specifically
        3. If asking for statistics, provide the numbers above
        4. Be concise but helpful
        5. Format lists with bullet points (-)
        6. At the end, suggest relevant navigation:
           - If discussing tasks, add: "View your [All Tasks](/tasks) or [Starred Tasks](/tasks/starred)"
           - If discussing completion, add: "Check [Completed Tasks](/tasks/completed)"
           - If discussing analytics, add: "See detailed stats on your [Profile](/profile)"
        7. Use plain text only, no Markdown bold/italic
        
        Provide a natural, conversational response.
    `;
    const summary = await generateText(readPrompt);
    return { message: summary };
}

// --- Handler for UPDATE Intent ---
async function handleUpdateTask(userId, textInput) {
    const userTasks = await Task.find({ user: userId, isDeleted: false, isCompleted: false }).select('title _id');
    const updateSchema = {
        type: "OBJECT",
        properties: {
            task_id: { type: "STRING", description: "The specific 'id' from the provided task list that matches the user's query." },
            update_fields: {
                type: "OBJECT",
                description: "The specific fields to change and their new values.",
                properties: {
                    title: { type: "STRING", nullable: true },
                    description: { type: "STRING", nullable: true },
                    dueDate: { type: "STRING", description: "ISO 8601 format", nullable: true },
                    priority: { type: "NUMBER", nullable: true }
                },
            }
        },
        required: ["task_id", "update_fields"]
    };
    const updatePrompt = `
        Analyze the user's command to update a task.
        User Command: "${textInput}"
        User's Task List: ${JSON.stringify(userTasks)}
        CRITICAL: The user is in 'Asia/Kolkata' (IST, UTC+5:30) timezone. Interpret all relative times ('tomorrow', '10pm') in this timezone.
        Today's date is ${new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })}.

        Instructions:
        1. Find the task the user is referring to from their task list. Set its 'id' as 'task_id'.
        2. Determine what fields they want to change and what the new values are. Set these in 'update_fields'.
        3. Convert all new dates/times to ISO 8601 format.
        Return ONLY the JSON object.
    `;
    const rawResponse = await generateStructuredText(updatePrompt, updateSchema);
    const action = extractJson(rawResponse);
    if (!action || !action.task_id || !action.update_fields) { throw new Error('AI failed to extract update details.'); }
    
    const taskToUpdate = await Task.findOne({ _id: new mongoose.Types.ObjectId(action.task_id), user: userId });
    if (!taskToUpdate) { throw new Error("Task not found or user not authorized."); }

    Object.assign(taskToUpdate, action.update_fields);
    await taskToUpdate.save();
    return { message: `Task updated: "${taskToUpdate.title}"` };
}

// --- Handler for DELETE Intent ---
async function handleDeleteTask(userId, textInput) {
    const userTasks = await Task.find({ user: userId, isDeleted: false, isCompleted: false }).select('title _id');
    const deleteSchema = { type: "OBJECT", properties: { task_id: { type: "STRING", description: "The 'id' of the task to delete." } }, required: ["task_id"] };
    const deletePrompt = `
        Analyze the user's command to delete a task.
        User Command: "${textInput}"
        User's Task List: ${JSON.stringify(userTasks)}
        
        Instructions:
        1. Find the task the user wants to delete from their task list.
        2. Set its 'id' as 'task_id'.
        Return ONLY the JSON object.
    `;
    const rawResponse = await generateStructuredText(deletePrompt, deleteSchema);
    const action = extractJson(rawResponse);
    if (!action || !action.task_id) { throw new Error('AI failed to identify task to delete.'); }

    const taskToDelete = await Task.findOne({ _id: new mongoose.Types.ObjectId(action.task_id), user: userId });
    if (!taskToDelete) { throw new Error("Task not found or user not authorized."); }

    taskToDelete.isDeleted = true; // Soft delete
    await taskToDelete.save();
    return { message: `Task moved to trash: "${taskToDelete.title}"` };
}


// --- Feature 2: The "Super-Assistant" Command Processor ---
// This is the main router function that decides which helper to call.
exports.processAiCommand = async (req, res) => {
    console.log('=== AI Command Request ===');
    console.log('Body:', req.body);
    console.log('User ID:', req.user?.id);

    // Accept both { textInput } and { question } and normalize
    const rawInput = (req.body && (req.body.textInput ?? req.body.question)) || '';
    const textInput = (typeof rawInput === 'string' ? rawInput : String(rawInput)).trim();
    const userId = req.user.id;
    if (!textInput) {
        console.log('ERROR: textInput/question is missing or empty');
        return res.status(400).json({ message: 'Text input is required.' });
    }

    // Fast path: greetings handled immediately to avoid HELP path edge cases
    const greetingRegex = /^(hi+|hello|hey+|yo+|hola|sup|hlo+)\b/i;
    if (greetingRegex.test(textInput)) {
        return res.json({
            answer: [
                'Hi! I\'m your DASH assistant. I can help you manage tasks, answer questions, and navigate the app.',
                'Try these:',
                '- Create a task with title, due date, priority, and reminders',
                '- Check what\'s overdue or due today',
                '- Open your calendar or completed tasks',
                '',
                'Open [All Tasks](/tasks), see [Starred Tasks](/tasks/starred), or view the [Calendar](/tasks/calendar).'
            ].join('\n')
        });
    }

    // --- 1. First Pass: Determine User Intent ---
    const intentSchema = { type: "OBJECT", properties: {
        intent: { type: "STRING", enum: ["CREATE", "READ", "UPDATE", "DELETE", "HELP"] },
    }, required: ["intent"]};
    const intentPrompt = `
        Analyze the user's text and determine their primary intent.
        - 'what', 'how', 'why', 'who', 'list features', 'help' -> HELP
        - 'what are my tasks', 'show me my tasks', 'summarize' -> READ
        - 'update', 'change', 'move', 'reschedule' -> UPDATE
        - 'delete', 'remove', 'trash' -> DELETE
        - 'create', 'add', 'remind me', 'new task' -> CREATE
        Return ONLY the JSON object.
        User Input: "${textInput}"
    `;

    try {
        const intentResponse = await generateStructuredText(intentPrompt, intentSchema);
        const intentDetails = extractJson(intentResponse);
        if (!intentDetails || !intentDetails.intent) { throw new Error('AI could not determine user intent.'); }

        // --- 2. Second Pass: Execute based on Intent ---
        let result;
        switch (intentDetails.intent) {
            case 'CREATE':
                result = await handleCreateTask(userId, textInput);
                return res.status(201).json(result);
            case 'READ':
                result = await handleReadTasks(userId, textInput);
                return res.json(result);
            case 'UPDATE':
                result = await handleUpdateTask(userId, textInput);
                return res.json(result);
            case 'DELETE':
                result = await handleDeleteTask(userId, textInput);
                return res.json(result);
            case 'HELP':
                // Reformat the request body to match askAboutDash's expected format
                req.body.question = textInput;
                req.body.textInput = textInput;
                return exports.askAboutDash(req, res);
            default:
                // If intent is UNKNOWN or anything else, pass to help
                req.body.question = textInput;
                req.body.textInput = textInput;
                return exports.askAboutDash(req, res);
        }
    } catch (error) {
        console.error("=== ERROR in processAiCommand ===");
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        console.error("User input was:", req.body.textInput);
        res.status(500).json({ message: 'Failed to process AI command. Check server logs.' });
    }
};




// const { generateText, generateStructuredText } = require('../services/aiService');
// const Task = require('../models/taskModel');
// const User = require('../models/userModel');
// const { sendEmail } = require('../services/emailService');
// const mongoose = require('mongoose');

// // --- Helper Function to Extract JSON ---
// const extractJson = (text) => {
//     if (!text || typeof text !== 'string') {
//         console.error("Invalid input to extractJson:", text);
//         return null;
//     }
//     const match = text.match(/```json\s*([\s\S]*?)\s*```|({[\s\S]*})/);
//     if (match) {
//         const jsonString = match[1] || match[2];
//         try {
//             return JSON.parse(jsonString);
//         } catch (e) {
//             console.error("Failed to parse extracted JSON string:", jsonString, e);
//             return null;
//         }
//     }
//     console.error("No JSON object pattern found in AI response:", text);
//     return null;
// };

// // --- Feature 1: AI Help Assistant (Updated Context) ---
// exports.askAboutDash = async (req, res) => {
//     const { question } = req.body;
//     const userId = req.user.id;
//     if (!question) {
//         return res.status(400).json({ message: 'Question is required.' });
//     }
//     const context = `
//         You are a friendly and helpful assistant for the DASH (Decisive Assistant for Scheduling) task management app.
//         Your goal is to answer user questions about how to use the app. Use simple, clear language and bullet points or numbered lists for steps.

//         Key DASH Features:
//         - Create tasks (title, description, due date/time).
//         - Set task priority (0-100% slider).
//         - Star important tasks.
//         - Mark tasks as complete.
//         - Add multiple reminders (including daily recurring ones).
//         - View tasks in different lists (All, Starred, Completed, Trash).
//         - View tasks on a Calendar page.
//         - View reminder history on a Notifications page.
//         - Manage profile (name, phone, password) and see stats on a Profile page.
//         - Automatically moves overdue tasks to Trash.

//         Answering Rules:
//         1. Answer only questions related to using the DASH app features listed above.
//         2. Keep your answers concise and easy to understand.
//         3. If the question is unrelated, politely state you can only help with DASH features.
//         4. **CRITICAL: DO NOT mention the developer's contact information (Vamshi Krishna, vamshikrishnadaripelli22@gmail.com) UNLESS the user explicitly asks "How can I contact the developer?" or "Who do I contact for help?".**
//     `;
//     const prompt = `${context}\n\nUser Question: "${question}"\n\nAnswer:`;
//     try {
//         const answer = await generateText(prompt);
//         const cleanedAnswer = answer.replace(/^[*\-]\s/gm, '').trim(); 
//         res.json({ answer: cleanedAnswer });
//     } catch (error) {
//         console.error("Error getting answer from AI:", error);
//         res.status(500).json({ message: 'Failed to get answer from AI assistant.' });
//     }
// };


// // --- Feature 2: Natural Language Task Creation (Final Version) ---
// exports.createTaskFromText = async (req, res) => {
//     const { textInput } = req.body;
//     const userId = req.user.id;

//     if (!textInput) {
//         return res.status(400).json({ message: 'Text input is required.' });
//     }

//     const taskSchema = {
//         type: "OBJECT",
//         properties: {
//             title: { type: "STRING", description: "The main title or subject of the task." },
//             description: { type: "STRING", description: "A MORE DETAILED description, if mentioned separately.", nullable: true },
//             dueDate: { type: "STRING", description: "The due date AND specific time (if mentioned) in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ). Infer the year.", nullable: true },
//             priority: { type: "NUMBER", description: "Suggested priority (0-100), default 50. Use 80-90 for 'important','urgent','asap'.", nullable: true },
//             alarms: { type: "ARRAY", description: "Any specific reminder times mentioned (ISO 8601).", items: { type: "STRING" }, nullable: true },
//             recurrence: { type: "STRING", description: "Is this a recurring task? If yes, specify frequency (e.g., 'daily', 'weekly').", nullable: true },
//             isRecurrentDaily: { type: "BOOLEAN", description: "Set to true if recurrence is 'daily'", nullable: true }
//         },
//     };

//     const prompt = `
//         Analyze the following user input and extract task details based on the provided JSON schema.
//         Today's date is ${new Date().toLocaleDateString('en-CA')}. Infer the current year if missing.
//         Interpret relative dates/times accurately (e.g., 'tomorrow morning 10', 'next Friday at 2pm', 'evening', 'weekend').
//         Convert extracted date AND time to ISO 8601 for dueDate. If no time is mentioned with a date, default time to 23:59:59.
//         Set priority based on keywords (urgent, important=85), default 50.
//         Check if the task is meant to recur daily and set recurrence field to 'daily' and isRecurrentDaily to true if so.
//         Put the main subject of the task in the 'title' field if possible. If the main subject fits better as a short description, use the 'description' field instead and make the title concise.
//         Return ONLY the JSON object, optionally wrapped in \`\`\`json markdown.

//         User Input: "${textInput}"
//     `;

//     try {
//         const rawResponse = await generateStructuredText(prompt, taskSchema);
//         // console.log("Raw AI Response for Task Creation:", rawResponse);
//         const taskDetails = extractJson(rawResponse);

//         if (!taskDetails) {
//             console.error("Failed to extract valid JSON from AI response:", rawResponse);
//             return res.status(500).json({ message: 'AI returned an unexpected format. Could not extract task details.' });
//         }

//         const extractedTitle = taskDetails.title || taskDetails.task_description || taskDetails.taskDescription || taskDetails.description;
//         const extractedDescription = (taskDetails.title && extractedTitle === taskDetails.description) ? '' : taskDetails.description;

//         if (!extractedTitle) {
//             console.error("AI failed to extract any valid task title/subject/description from JSON:", taskDetails);
//             throw new Error("AI failed to extract a valid task identifier.");
//         }

//         let finalAlarms = [];
//         let validDueDate = null;
//         let isDailyRecurrence = (taskDetails.recurrence && taskDetails.recurrence.toLowerCase() === 'daily') || (taskDetails.isRecurrentDaily === true);

//         if (taskDetails.dueDate && !isNaN(new Date(taskDetails.dueDate))) {
//             validDueDate = new Date(taskDetails.dueDate);
//             const dueDateMillis = validDueDate.getTime();
//             const reminder10Min = new Date(dueDateMillis - 10 * 60 * 1000);
//             const reminder5Min = new Date(dueDateMillis - 5 * 60 * 1000);
//             const now = new Date();
//             if (reminder10Min > now) finalAlarms.push({ time: reminder10Min, repeatDaily: isDailyRecurrence });
//             if (reminder5Min > now) finalAlarms.push({ time: reminder5Min, repeatDaily: isDailyRecurrence });
//             if (isDailyRecurrence && finalAlarms.length === 0 && validDueDate > now) {
//                  finalAlarms.push({ time: validDueDate, repeatDaily: true });
//             }
//         }

//         if (taskDetails.alarms && Array.isArray(taskDetails.alarms)) {
//             taskDetails.alarms.forEach(a => {
//                 const alarmDate = new Date(a);
//                 if (!isNaN(alarmDate)) {
//                     if (!finalAlarms.some(existing => existing.time.getTime() === alarmDate.getTime())) {
//                          finalAlarms.push({ time: alarmDate, repeatDaily: isDailyRecurrence });
//                     }
//                 }
//             });
//         }

//         const newTask = new Task({
//             user: userId,
//             title: extractedTitle,
//             description: extractedDescription || '',
//             priority: taskDetails.priority || 50,
//             dueDate: validDueDate,
//             alarms: finalAlarms,
//             isStarred: false, isCompleted: false, isDeleted: false,
//         });

//         const savedTask = await newTask.save();

//         const user = await User.findById(userId);
//         if (user) {
//             let detailsHtml = '';
//             const dateTimeOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' };
//             if (savedTask.dueDate) {
//                 detailsHtml += `<br><b>🎯 Deadline:</b> ${new Date(savedTask.dueDate).toLocaleString('en-US', dateTimeOptions)}`;
//             }
//             if (savedTask.alarms && savedTask.alarms.length > 0) {
//                 const nextAlarmTime = new Date(Math.min(...savedTask.alarms.map(alarm => new Date(alarm.time))));
//                 detailsHtml += `<br><b>⏰ First Reminder:</b> ${nextAlarmTime.toLocaleString('en-US', dateTimeOptions)}`;
//             }
//             const emailSubject = `🚀 New Quest Added (by AI): ${savedTask.title}`;
//             const emailBody = `Hi ${user.name},<br><br>Your assistant has created a new task for you: "<strong>${savedTask.title}</strong>". Here are the details:${detailsHtml}<br><br>You've got this!`;
//             await sendEmail(user.email, emailSubject, emailBody);
//         }

//         res.status(201).json({ message: 'Task created successfully by AI!', task: savedTask });

//     } catch (error) {
//         console.error("Error creating task from text via AI:", error);
//         res.status(500).json({ message: 'Failed to create task using AI. Check server logs for details.' });
//     }
// };

// // --- NO MORE CODE AFTER THIS LINE ---






