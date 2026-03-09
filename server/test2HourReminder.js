// Test script to manually trigger 2-hour reminder check
require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('./models/taskModel');
const User = require('./models/userModel');
const Notification = require('./models/notificationModel');
const { sendEmail } = require('./services/emailService');
const { generateText } = require('./services/aiService');

const test2HourReminders = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DB_URL);
        console.log('✅ MongoDB connected');

        const now = new Date();
        const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        const oneHourFiftyFiveMin = new Date(now.getTime() + 115 * 60 * 1000); // 1h55m from now
        const twoHoursTenMin = new Date(now.getTime() + 130 * 60 * 1000); // 2h10m from now

        console.log('\n📊 Debug Information:');
        console.log('Current time:', now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        console.log('2 hours from now:', twoHoursFromNow.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        console.log('Search window start (1h55m):', oneHourFiftyFiveMin.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        console.log('Search window end (2h10m):', twoHoursTenMin.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

        // Find tasks due in approximately 2 hours
        const upcomingTasks = await Task.find({
            isCompleted: false,
            isDeleted: false,
            twoHourReminderSent: false,
            dueDate: { 
                $gte: oneHourFiftyFiveMin, 
                $lte: twoHoursTenMin 
            }
        }).populate('user');

        console.log(`\n🔍 Found ${upcomingTasks.length} task(s) in the 2-hour window\n`);

        if (upcomingTasks.length === 0) {
            console.log('No tasks found. Checking all pending tasks...');
            const allPending = await Task.find({
                isCompleted: false,
                isDeleted: false
            }).select('title dueDate twoHourReminderSent');
            
            console.log('\nAll pending tasks:');
            allPending.forEach(t => {
                console.log(`- "${t.title}" | Due: ${t.dueDate ? new Date(t.dueDate).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) : 'No due date'} | 2hr sent: ${t.twoHourReminderSent}`);
            });
            
            await mongoose.connection.close();
            return;
        }

        // Process each task
        for (const task of upcomingTasks) {
            if (!task.user) {
                console.log(`⚠️  Skipping "${task.title}" - no user found`);
                continue;
            }

            console.log(`\n📧 Sending 2-hour reminder for "${task.title}"...`);
            console.log(`   User: ${task.user.name} (${task.user.email})`);
            console.log(`   Due: ${new Date(task.dueDate).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}`);

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

            console.log('   Generating AI message...');
            const aiMessage = await generateText(prompt);
            console.log(`   AI Message: "${aiMessage}"`);

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

            console.log('   Sending email...');
            await sendEmail(task.user.email, emailSubject, emailBody);
            
            console.log('   Creating notification...');
            await Notification.create({ 
                user: task.user._id, 
                message: `⏰ Reminder: "${task.title}" is due in 2 hours at ${dueTime}`,
                type: 'email'
            });
            
            console.log('   Marking task as reminder sent...');
            await Task.findByIdAndUpdate(task._id, { twoHourReminderSent: true });
            
            console.log(`✅ Successfully sent 2-hour reminder for "${task.title}"`);
        }

        console.log('\n✅ Test completed successfully!\n');
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error);
        await mongoose.connection.close();
    }
};

test2HourReminders();
