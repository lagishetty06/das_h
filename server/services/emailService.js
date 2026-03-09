const nodemailer = require('nodemailer');

// This function sends an email.
const sendEmail = async (to, subject, htmlContent) => {
    try {
        // Create a transporter object using the configuration from environment variables.
        // For Gmail, you MUST use an "App Password" if you have 2-Factor Authentication enabled.
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS, // Your email app password
            },
        });

        // Define the email options
        const mailOptions = {
            from: `"DASH" <${process.env.EMAIL_USER}>`, // Sender name and address
            to: to, // Recipient email address
            subject: subject, // Subject line
            html: htmlContent, // Email body in HTML format
        };

        // Send the email and log success
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        // Log any errors that occur during the process
        console.error(`Error sending email to ${to}:`, error);
        // We don't throw an error here to prevent the whole app from crashing if an email fails.
    }
};

module.exports = { sendEmail };