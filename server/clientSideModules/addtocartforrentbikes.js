const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authenticate = require("../middelware/authenticate");

const User = require("../models/userSchema");
const Rentbike = require("../models/rentbikeSchema");
const Rentcart = require("../models/rentcartSchema");

router.post("/addrentcartocart", authenticate, async (req, res) => {
  try {
    const { itemId, rentHours } = req.body;

    // 🔒 VALIDATION
    if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ error: "Invalid bike ID" });
    }

    if (!rentHours || isNaN(rentHours) || rentHours <= 0) {
      return res.status(400).json({ error: "Invalid rent hours" });
    }

    const user = await User.findById(req.userID);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const bike = await Rentbike.findById(itemId);
    if (!bike) {
      return res.status(404).json({ error: "Bike not found" });
    }

    let cart = await Rentcart.findOne({ userById: user._id });

    const cartItem = {
      rentbikeid: bike._id,
      requiredhours: rentHours,
      rentperhour: bike.rent,
      totalbill: bike.rent * rentHours,
      brand: bike.brand,
      model: bike.model,
    };

    if (cart) {
      const exists = cart.cartItems.some(
        (item) => item.rentbikeid.toString() === itemId
      );

      if (exists) {
        return res.status(409).json({ error: "Item already in cart" });
      }

      cart.cartItems.push(cartItem);
      await cart.save();
      return res.status(201).json(cart);
    }

    const newCart = new Rentcart({
      userById: user._id,
      cartItems: [cartItem],
    });

    await newCart.save();
    res.status(201).json(newCart);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
