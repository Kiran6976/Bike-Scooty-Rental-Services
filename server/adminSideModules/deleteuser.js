const express = require('express');
const router = express.Router();
const adminAuthentication = require("../middelware/adminAuthentication");
const User = require('../models/userSchema');

router.post(
  '/deleteUserfromdashboard',
  adminAuthentication,
  async (req, res) => {
    try {
      const { userIdFromDashBoard } = req.body;

      if (!userIdFromDashBoard) {
        return res.status(400).json({ error: "User ID required" });
      }

      const deletedUser = await User.findByIdAndDelete(userIdFromDashBoard);

      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
