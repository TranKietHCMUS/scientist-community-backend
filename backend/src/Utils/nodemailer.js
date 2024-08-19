const nodemailer = require('nodemailer');
require("dotenv").config()

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.ACCOUNT_GMAIL,
        pass: process.env.PASSWORD_GMAIL
    },
});

const sendEmail = async (to, text) => {
    const mailOptions = {
        from: process.env.ACCOUNT_GMAIL,
        to: to,
        subject: "Verify Code",
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) 
    {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
