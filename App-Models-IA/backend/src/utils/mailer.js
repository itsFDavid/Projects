const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
}, console.log('Email sent'));


exports.sendVerificationEmail = async (email, code) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verificación de Email',
        text: `Tu código de verificación es: ${code}`,
    };
    console.log("Sending email to: ", email);
    await transporter.sendMail(mailOptions);
};
