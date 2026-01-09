const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmailOTP = async (email, otp) => {
    await transporter.sendMail({
        from: `"BikeBook 🚲" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "BikeBook Email Verification",
        html: `
            <h2>Email Verification</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
            <p>OTP valid for 5 minutes</p>
        `
    });
};

module.exports = sendEmailOTP;
