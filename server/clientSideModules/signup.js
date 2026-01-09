const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const sendEmailOTP = require('../utils/sendEmail');

router.post('/signup', async (req, res) => {
    const { name, phone, email, password, cPassword } = req.body;

    if (!name || !phone || !email || !password || !cPassword) {
        return res.status(422).json({ error: "All fields are required" });
    }

    if (password !== cPassword) {
        return res.status(422).json({ error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isVerified) {
        return res.status(409).json({ error: "Email already registered" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let user;

    if (existingUser && !existingUser.isVerified) {
        // Update OTP if user exists but not verified
        existingUser.emailOTP = otp;
        existingUser.otpExpiry = Date.now() + 5 * 60 * 1000;
        await existingUser.save();
        user = existingUser;
    } else {
        user = new User({
            name,
            phone,
            email,
            password,
            cPassword,
            emailOTP: otp,
            otpExpiry: Date.now() + 5 * 60 * 1000
        });
        await user.save();
    }

    await sendEmailOTP(email, otp);

    res.status(201).json({
        message: "OTP sent to email. Please verify."
    });
});

module.exports = router;
