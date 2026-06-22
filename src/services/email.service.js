const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

// Verify connection
transporter.verify((error, success) => {
    if (error) {
        console.log("Error while connecting to the email server:", error);
    } else {
        console.log("Email server is ready to send messages");
    }
});

// Generic send email function
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"BT System" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

// Registration Email
const sendRegistrationEmail = async (userEmail, name) => {
    const subject = "Welcome to BT-System";

    const text = `
        Hello ${name},
        Thank you for registering at BT-System.
        We're excited to have you on board!
        Regards,
        BT-System Team
            
    `;

    const html = `
        <div style="font-family: Arial, sans-serif;">
            <h2>Welcome to BT-System 🎉</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>Thank you for registering at BT-System.</p>
            <p>We're excited to have you on board!</p>
            <br/>
            <p>Regards,</p>
            <p><strong>BT-System Team</strong></p>
        </div>
    `;

    return await sendEmail(userEmail, subject, text, html);
};


async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Successful!';
    const text = `Hello ${name},\n\nYour transaction of $${amount} to account ${toAccount} was successful.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello ${name},</p><p>Your transaction of $${amount} to account ${toAccount} was successful.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Failed';
    const text = `Hello ${name},\n\nWe regret to inform you that your transaction of $${amount} to account ${toAccount} has failed. Please try again later.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello ${name},</p><p>We regret to inform you that your transaction of $${amount} to account ${toAccount} has failed. Please try again later.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
};