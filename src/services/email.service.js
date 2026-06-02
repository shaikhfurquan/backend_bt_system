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

module.exports = {
    sendRegistrationEmail,
};