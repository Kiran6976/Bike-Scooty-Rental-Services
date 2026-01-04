const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const authenticate = require("../middelware/authenticate");
const User = require("../models/userSchema");

router.post("/change-password", authenticate, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "All fields required" });
    }

    const isMatch = await bcrypt.compare(oldPassword, req.rootUser.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Old password incorrect" });
    }

    req.rootUser.password = newPassword;
    req.rootUser.cPassword = newPassword;

    await req.rootUser.save();

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Password update failed" });
  }
});

module.exports = router;
