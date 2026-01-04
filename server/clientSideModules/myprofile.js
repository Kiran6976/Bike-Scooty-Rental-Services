const express = require("express");
const router = express.Router();
const authenticate = require("../middelware/authenticate");
const Rentcart = require("../models/rentcartSchema");

router.get("/myprofile", authenticate, async (req, res) => {
  try {
    const orders = await Rentcart.find({ userById: req.userID })
      .sort({ createdAt: -1 });

    res.status(200).json({
      user: {
        name: req.rootUser.name,
        email: req.rootUser.email,
        phone: req.rootUser.phone,
      },
      orders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch profile data" });
  }
});

module.exports = router;
