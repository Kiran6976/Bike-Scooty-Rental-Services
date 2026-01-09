const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/userSchema');

// User signin route
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please fill all fields" });
        }

        const userSignin = await User.findOne({ email });

        if (!userSignin) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        if (!userSignin.isVerified) {
            return res.status(403).json({
                error: "Please verify your email before signing in"
            });
        }

        const isMatch = await bcrypt.compare(password, userSignin.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = await userSignin.generateAuthToken();

        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000), // ~30 days
            httpOnly: true
        });

        res.status(200).json({ message: "User signed in successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
