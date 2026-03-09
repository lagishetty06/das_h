const cron = require('node-cron');
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const { sendEmail } = require('./emailService');
const { generateText } = require('../services/aiService'); // Make sure aiService is imported

// --- Helper Function 1: Permanent Deletion ---
const purgeOldTasks = async () => {
    try {
        const oneWeekAgo = new Date(new Date().setDate(new Date().getDate() - 7));
        const tasksToDelete = await Task.find({
            isDeleted: true,
            dueDate: { $lt: oneWeekAgo } 
        });

        if (tasksToDelete.length > 0) {
            console.log(`Found ${tasksToDelete.length} old tasks to purge permanently.`);
            const idsToDelete = tasksToDelete.map(task => task._id);
            await Task.deleteMany({ _id: { $in: idsToDelete } });
        }
    } catch (error) {
        console.error('Error during old task purge:', error);
    }
};

// --- Helper Function 2: Move Overdue to Trash ---
const cleanupOverdueTasks = async () => {
    const now = new Date();
    try {
        const overdueTasks = await Task.find({
            isDeleted: false,
            dueDate: { $lt: now } 
        });

        if (overdueTasks.length > 0) {
            console.log(`Found ${overdueTasks.length} overdue tasks to move to trash.`);
            const idsToMove = overdueTasks.map(task => task._id);
            await Task.updateMany(
                { _id: { $in: idsToMove } },
                { $set: { isDeleted: true } } 
            );
        }
    } catch (error) {
        console.error('Error during overdue task cleanup:', error);
    }
};

// --- Helper Function 3: Handle Reminders ---
const handleReminders = async (now) => {
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    try {
        // Find one-time tasks
        const oneTimeTasks = await Task.find({
            isCompleted: false, isDeleted: false, 'alarms.repeatDaily': false,
            'alarms.time': { $gte: now, $lt: new Date(now.getTime() + 60 * 1000) }
        }).populate('user');

        // Find daily tasks
        const dailyTasks = await Task.find({
            isCompleted: false, isDeleted: false, 'alarms.repeatDaily': true,
        }).populate('user');

        const allTasksToRemind = [...oneTimeTasks];
        dailyTasks.forEach(dailyTask => {
            const shouldRemind = dailyTask.alarms.some(alarm => 
                alarm.repeatDaily &&
                new Date(alarm.time).getHours() === currentHour &&
                new Date(alarm.time).getMinutes() === currentMinute
            );
            if (shouldRemind && !allTasksToRemind.find(t => t._id.equals(dailyTask._id))) {
                allTasksToRemind.push(dailyTask);
            }
        });

        if (allTasksToRemind.length > 0) {
            console.log(`Found ${allTasksToRemind.length} tasks with reminders.`);
            for (const task of allTasksToRemind) {
                if (task.user) {
                    const reminderMessage = `Reminder for your task: "${task.title}".`;
                    await Notification.create({ user: task.user._id, message: reminderMessage });
                    await sendEmail(task.user.email, `🔔 Quick Reminder: ${task.title}`, `Hi ${task.user.name}, ${reminderMessage}`);
                }
            }
        }
    } catch (error) {
        console.error('Error handling reminders:', error);
    }
};

// --- Helper Function 4: AI Daily Briefing at 6:40 AM ---
const sendDailyBriefing = async () => {
    try {
        const allUsers = await User.find({ isEmailVerified: true });

        for (const user of allUsers) {
            const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));
            const endOfToday = new Date(new Date().setHours(23, 59, 59, 999));
            
            const tasksToday = await Task.find({
                user: user._id,
                isCompleted: false,
                isDeleted: false,
                dueDate: { $gte: startOfToday, $lte: endOfToday }
            }).sort({ priority: -1, dueDate: 1 });

            if (tasksToday.length === 0) {
                console.log(`No tasks due today for ${user.email}. Skipping daily briefing.`);
                continue; 
            }

            let taskListHtml = '<ul style="margin: 10px 0; padding-left: 20px;">';
            tasksToday.forEach(t => {
                const timeStr = new Date(t.dueDate).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    timeZone: 'Asia/Kolkata' 
                });
                const priorityText = t.priority > 75 ? '🔴 High' : t.priority > 40 ? '🟡 Medium' : '🟢 Low';
                taskListHtml += `<li style="margin: 8px 0;"><strong>${t.title}</strong> - ${timeStr} (${priorityText})</li>`;
            });
            taskListHtml += '</ul>';
            
            // Build AI prompt for personalized message
            let taskListString = tasksToday.map(t => 
                `- ${t.title} (Due: ${new Date(t.dueDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}, Priority: ${t.priority}%)`
            ).join('\n');
            
            const prompt = `
                You are DASH, a friendly and motivational AI assistant.
                The user, ${user.name}, has ${tasksToday.length} task(s) due today.
                
                Task List:
                ${taskListString}

                Write a brief, encouraging message (2-3 sentences, max 60 words) to motivate them to tackle today's tasks.
                Mention the most important task by name. Be positive and energetic.
                Do not use markdown formatting.
            `;

            const aiMessage = await generateText(prompt);

            const emailSubject = `🌅 Good Morning! You have ${tasksToday.length} task${tasksToday.length > 1 ? 's' : ''} due today`;
            const emailBody = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
                        <h2 style="margin: 0;">☀️ Good Morning, ${user.name}!</h2>
                        <p style="margin: 5px 0 0 0; opacity: 0.9;">Your Daily Task Briefing</p>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px;">
                        <div style="background-color: white; border-left: 4px solid #667eea; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
                            <p style="margin: 0; color: #333; line-height: 1.6;">${aiMessage}</p>
                        </div>
                        
                        <h3 style="color: #333; margin: 20px 0 10px 0;">📋 Tasks Due Today:</h3>
                        ${taskListHtml}
                        
                        <div style="margin-top: 20px; padding: 15px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 8px; text-align: center;">
                            <p style="color: white; margin: 0; font-weight: bold;">💪 You've got this! Let's make today productive!</p>
                        </div>
                    </div>
                </div>
            `;
            
            await sendEmail(user.email, emailSubject, emailBody);
            await Notification.create({ 
                user: user._id, 
                message: `Good morning! You have ${tasksToday.length} task${tasksToday.length > 1 ? 's' : ''} due today.`,
                type: 'email'
            });
            console.log(`Sent morning briefing to ${user.email} for ${tasksToday.length} tasks`);
        }
    } catch (error) {
        console.error('Error sending daily briefings:', error);
    }
};

// --- Helper Function 5: AI-Powered 2-Hour Before Deadline Reminders ---
const send2HourReminders = async () => {
    try {
        const now = new Date();
        const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        const oneHourFiftyFiveMin = new Date(now.getTime() + 115 * 60 * 1000); // 1h55m from now
        const twoHoursTenMin = new Date(now.getTime() + 130 * 60 * 1000); // 2h10m from now

        console.log(`[2-Hour Check] Current time: ${now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}`);
        console.log(`[2-Hour Check] Looking for tasks due between: ${oneHourFiftyFiveMin.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} and ${twoHoursTenMin.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}`);

        // Find tasks due in approximately 2 hours (with wider window: 1h55m to 2h10m)
        const upcomingTasks = await Task.find({
            isCompleted: false,
            isDeleted: false,
            twoHourReminderSent: false, // Only tasks that haven't received reminder yet
            dueDate: { 
                $gte: oneHourFiftyFiveMin, 
                $lte: twoHoursTenMin 
            }
        }).populate('user');

        console.log(`[2-Hour Check] Found ${upcomingTasks.length} tasks in the 2-hour window`);
        
        if (upcomingTasks.length === 0) {
            return;
        }

        console.log(`✅ Found ${upcomingTasks.length} tasks due in ~2 hours. Sending AI reminders...`);

        for (const task of upcomingTasks) {
            if (!task.user) {
                console.log(`⚠️ Skipping task "${task.title}" - no user found`);
                continue;
            }

            console.log(`📧 Preparing 2-hour reminder for "${task.title}" to ${task.user.email}`);

            const dueTime = new Date(task.dueDate).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                timeZone: 'Asia/Kolkata' 
            });

            // Generate AI message
            const prompt = `
                You are DASH, a friendly AI productivity assistant.
                The user has a task "${task.title}" due in exactly 2 hours at ${dueTime}.
                Priority level: ${task.priority}%
                ${task.description ? `Description: ${task.description}` : ''}

                Write a brief, friendly reminder message (2 sentences, max 40 words) to help them prepare.
                Be encouraging and specific about the 2-hour timeframe.
                Do not use markdown formatting.
            `;

            const aiMessage = await generateText(prompt);

            const emailSubject = `⏰ 2-Hour Alert: "${task.title}" due soon!`;
            const emailBody = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
                        <h2 style="margin: 0;">⏰ 2-Hour Alert!</h2>
                        <p style="margin: 5px 0 0 0; opacity: 0.9;">Task Deadline Approaching</p>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px;">
                        <div style="background-color: white; border-left: 4px solid #f5576c; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
                            <p style="margin: 0; color: #333; line-height: 1.6; font-size: 16px;">${aiMessage}</p>
                        </div>
                        
                        <div style="background-color: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                            <h3 style="margin: 0 0 10px 0; color: #333;">📌 Task Details:</h3>
                            <p style="margin: 5px 0;"><strong>Title:</strong> ${task.title}</p>
                            <p style="margin: 5px 0;"><strong>Due:</strong> ${dueTime} (in 2 hours)</p>
                            <p style="margin: 5px 0;"><strong>Priority:</strong> ${task.priority > 75 ? '🔴 High' : task.priority > 40 ? '🟡 Medium' : '🟢 Low'}</p>
                            ${task.description ? `<p style="margin: 10px 0 5px 0;"><strong>Description:</strong></p><p style="margin: 5px 0; color: #666;">${task.description}</p>` : ''}
                        </div>
                        
                        <div style="padding: 12px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 5px;">
                            <p style="margin: 0; color: #856404; font-weight: 500;">💡 You have 2 hours to complete this task!</p>
                        </div>
                    </div>
                </div>
            `;

            await sendEmail(task.user.email, emailSubject, emailBody);
            await Notification.create({ 
                user: task.user._id, 
                message: `⏰ Reminder: "${task.title}" is due in 2 hours at ${dueTime}`,
                type: 'email'
            });
            
            // Mark that 2-hour reminder was sent to prevent duplicates
            await Task.findByIdAndUpdate(task._id, { twoHourReminderSent: true });
            
            console.log(`✅ Successfully sent 2-hour AI reminder to ${task.user.email} for task "${task.title}"`);
        }
    } catch (error) {
        console.error('❌ Error sending 2-hour reminders:', error);
    }
};

// --- Helper Function 6: Check and Reschedule Reminders ---
const checkReminders = async () => {
  try {
    const now = new Date();
    
    const tasks = await Task.find({
      isCompleted: false,
      isTrashed: false,
      'reminders.0': { $exists: true },
    });

    for (const task of tasks) {
      for (const reminder of task.reminders) {
        const reminderTime = new Date(reminder.time);
        const timeDiff = now - reminderTime;

        // Check if it's time for the reminder (within 1 minute window)
        if (timeDiff >= 0 && timeDiff < 60000) {
          await sendReminderEmail(task);

          // Handle different repeat types
          if (reminder.repeatType === 'daily' || reminder.daily) {
            // Set next day's reminder
            const nextReminder = new Date(reminderTime);
            nextReminder.setDate(nextReminder.getDate() + 1);
            reminder.time = nextReminder;
          } else if (reminder.repeatType === 'monthly') {
            // Set next month's reminder
            const nextReminder = new Date(reminderTime);
            nextReminder.setMonth(nextReminder.getMonth() + 1);
            nextReminder.setDate(reminder.monthlyDay || 1);
            reminder.time = nextReminder;
          } else if (reminder.repeatType === 'yearly') {
            // Set next year's reminder
            const nextReminder = new Date(reminderTime);
            nextReminder.setFullYear(nextReminder.getFullYear() + 1);
            nextReminder.setMonth((reminder.yearlyMonth || 1) - 1);
            nextReminder.setDate(reminder.yearlyDay || 1);
            reminder.time = nextReminder;
          } else {
            // One-time reminder - remove it
            task.reminders = task.reminders.filter(r => r._id.toString() !== reminder._id.toString());
          }
          
          await task.save();
        }
      }
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
};

// --- Main Service Starter ---
const startReminderService = () => {
    console.log('🚀 Advanced reminder and cleanup service started.');

    // 1. Run reminder check, cleanup, and purge every minute
    cron.schedule('* * * * *', async () => {
        const now = new Date();
        console.log(`[${now.toLocaleTimeString()}] Running minute-by-minute checks...`);
        await handleReminders(now);
        await cleanupOverdueTasks();
        await purgeOldTasks();
    });

    // 2. Run the "Morning Daily Briefing" every day at 6:40 AM IST
    cron.schedule('40 6 * * *', async () => {
        console.log("--- ☀️ Running 6:40 AM Daily Briefing ---");
        await sendDailyBriefing();
    }, {
        timezone: "Asia/Kolkata"
    });

    // 3. Run the "2-Hour Before Deadline" AI reminder every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
        console.log("--- ⏰ Checking for 2-hour deadline reminders ---");
        await send2HourReminders();
    });
    
    console.log('📅 Scheduled jobs:');
    console.log('   - Reminders, cleanup & purge: Every minute');
    console.log('   - Morning briefing: Daily at 6:40 AM IST');
    console.log('   - 2-hour deadline alerts: Every 5 minutes');
};

// --- Export the function that starts the service ---
module.exports = { startReminderService };

// --- NO DUPLICATE CODE BELOW THIS LINE ---







// const cron = require('node-cron');
// const Task = require('../models/taskModel');
// const Notification = require('../models/notificationModel');
// const { sendEmail } = require('./emailService');

// // --- NEW: Function to permanently purge old tasks from the trash ---
// const purgeOldTasks = async () => {
//     try {
//         // Calculate the date 7 days ago
//         const oneWeekAgo = new Date(new Date().setDate(new Date().getDate() - 7));

//         // Find tasks that are:
//         // 1. In the trash (isDeleted: true)
//         // 2. Their due date passed more than 7 days ago
//         const tasksToDelete = await Task.find({
//             isDeleted: true,
//             dueDate: { $lt: oneWeekAgo } // $lt means "less than"
//         });

//         if (tasksToDelete.length > 0) {
//             console.log(`Found ${tasksToDelete.length} old tasks to purge permanently.`);
//             const idsToDelete = tasksToDelete.map(task => task._id);
            
//             // Perform a single, efficient operation to delete all matched tasks
//             await Task.deleteMany({ _id: { $in: idsToDelete } });
//         }
//     } catch (error) {
//         console.error('Error during old task purge:', error);
//     }
// };

// // --- This is the existing function to move overdue tasks to trash ---
// const cleanupOverdueTasks = async () => {
//     const now = new Date();
//     try {
//         const overdueTasks = await Task.find({
//             isDeleted: false,
//             dueDate: { $lt: now } 
//         });

//         if (overdueTasks.length > 0) {
//             console.log(`Found ${overdueTasks.length} overdue tasks to move to trash.`);
//             const idsToMove = overdueTasks.map(task => task._id);
//             await Task.updateMany(
//                 { _id: { $in: idsToMove } },
//                 { $set: { isDeleted: true } } 
//             );
//         }
//     } catch (error) {
//         console.error('Error during overdue task cleanup:', error);
//     }
// };

// const startReminderService = () => {
//     console.log('Advanced reminder and cleanup service scheduled to run every minute.');
    
//     cron.schedule('* * * * *', async () => {
//         const now = new Date();
//         const currentHour = now.getHours();
//         const currentMinute = now.getMinutes();
//         console.log(`[${now.toLocaleTimeString()}] Running service checks...`);

//         // --- Execute ALL THREE functions every minute ---
//         await handleReminders(now, currentHour, currentMinute);
//         await cleanupOverdueTasks();
//         await purgeOldTasks(); // NEW function is called here
//     });
// };

// // The function to handle sending reminders (no changes)
// const handleReminders = async (now, currentHour, currentMinute) => {
//     try {
//         // Find one-time tasks
//         const oneTimeTasks = await Task.find({
//             isCompleted: false, isDeleted: false, 'alarms.repeatDaily': false,
//             'alarms.time': { $gte: now, $lt: new Date(now.getTime() + 60 * 1000) }
//         }).populate('user');

//         // Find daily tasks
//         const dailyTasks = await Task.find({
//             isCompleted: false, isDeleted: false, 'alarms.repeatDaily': true,
//         }).populate('user');

//         const allTasksToRemind = [...oneTimeTasks];
//         dailyTasks.forEach(dailyTask => {
//             const shouldRemind = dailyTask.alarms.some(alarm => 
//                 alarm.repeatDaily &&
//                 new Date(alarm.time).getHours() === currentHour &&
//                 new Date(alarm.time).getMinutes() === currentMinute
//             );
//             if (shouldRemind && !allTasksToRemind.find(t => t._id.equals(dailyTask._id))) {
//                 allTasksToRemind.push(dailyTask);
//             }
//         });

//         if (allTasksToRemind.length > 0) {
//             console.log(`Found ${allTasksToRemind.length} tasks with reminders.`);
//             for (const task of allTasksToRemind) {
//                 if (task.user) {
//                     const reminderMessage = `Reminder for your task: "${task.title}".`;
//                     await Notification.create({ user: task.user._id, message: reminderMessage });
//                     await sendEmail(task.user.email, `🔔 Quick Reminder: ${task.title}`, `Hi ${task.user.name}, ${reminderMessage}`);
//                 }
//             }
//         }
//     } catch (error) {
//         console.error('Error handling reminders:', error);
//     }
// };

// module.exports = { startReminderService };







