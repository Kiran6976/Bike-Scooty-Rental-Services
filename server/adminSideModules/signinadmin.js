const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcryptjs');

const Admin = require('../models/adminSchema');

// Admin Signin
router.post('/signinAdmin', async (req, res) => {
  try {
    const { adminName, adminPassword } = req.body;

    if (!adminName || !adminPassword) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }

    const admin = await Admin.findOne({ adminName });

    if (!admin) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(adminPassword, admin.adminPassword);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = await admin.generateAuthToken();

    res.cookie("jwtAdmin", token, {
      expires: new Date(Date.now() + 25892000000),
      httpOnly: true
    });

    res.status(200).json({ message: "Admin signed in successfully" });

  } catch (error) {
    console.error("Admin signin error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
