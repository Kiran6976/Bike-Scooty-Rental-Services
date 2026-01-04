const express = require("express");
const router = express.Router();
const authenticate = require("../middelware/authenticate");
const Rentcart = require("../models/rentcartSchema");

router.post("/deleteRentCartItem", authenticate, async (req, res) => {
  try {
    const { rentCartItemId } = req.body;

    await Rentcart.updateOne(
      { userById: req.userID },
      { $pull: { cartItems: { _id: rentCartItemId } } }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete rent item" });
  }
});

module.exports = router;
