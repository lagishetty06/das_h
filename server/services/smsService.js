const twilio = require('twilio');

// This function sends an SMS.
const sendSms = async (to, body) => {
    // Only proceed if all necessary Twilio credentials are provided in the .env file
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
        console.warn('Twilio credentials are not set. Skipping SMS.');
        return;
    }

    try {
        // Initialize the Twilio client with your Account SID and Auth Token
        const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        // Send the message
        await client.messages.create({
            body: body, // The content of the SMS
            from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
            to: to, // The recipient's phone number
        });
        console.log(`SMS sent successfully to ${to}`);
    } catch (error) {
        // Log errors, especially helpful for debugging issues like invalid phone numbers
        console.error(`Error sending SMS to ${to}:`, error.message);
    }
};

module.exports = { sendSms };