const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");

router.post("/verify-email-otp", async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ error: "User not found" });
    }

    if (
        user.emailOTP !== otp ||
        user.otpExpiry < Date.now()
    ) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.emailOTP = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
});

module.exports = router;
