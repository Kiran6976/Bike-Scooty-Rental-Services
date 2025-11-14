const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Admin = require('../models/adminSchema');

// Admin Registration Route
router.post('/registerAdmin', async (req, res) => {
  const { adminName, email, phone, adminPassword, cPassword } = req.body;

  if (!adminName || !email || !phone || !adminPassword || !cPassword) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  if (adminPassword !== cPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const adminExists = await Admin.findOne({ adminName });
    if (adminExists) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    const admin = new Admin({ adminName, email, phone, adminPassword, cPassword });
    await admin.save();

    res.status(201).json({ message: "Admin registered successfully" });

  } catch (err) {
    console.error("Admin signup error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
