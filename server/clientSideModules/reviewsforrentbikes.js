const express = require("express");
const router = express.Router();
const authenticate = require("../middelware/authenticate");

const User = require("../models/userSchema");
const Rentbike = require("../models/rentbikeSchema");
const Rentbikereviews = require("../models/rentbikereviewSchema");

/* ============================
   GET BIKE + USER DATA
============================ */
router.get("/rentbike/:bikeId/reviews/data", authenticate, async (req, res) => {
  try {
    const { bikeId } = req.params;

    const findBike = await Rentbike.findById(bikeId);
    const findUser = await User.findById(req.userID);

    if (!findBike) {
      return res.status(404).json({ error: "Bike not found" });
    }

    res.status(200).json({ findBike, findUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================
   GET ALL REVIEWS
============================ */
router.get("/rentbike/:bikeId/reviews", authenticate, async (req, res) => {
  try {
    const { bikeId } = req.params;

    const reviews = await Rentbikereviews.findOne({ bikeById: bikeId });

    res.status(200).json({
      allReviews: reviews ? reviews.allReviews : [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================
   POST REVIEW
============================ */
router.post("/rentbike/:bikeId/reviews", authenticate, async (req, res) => {
  try {
    const { bikeId } = req.params;
    const { name, email, message } = req.body;

    let reviewDoc = await Rentbikereviews.findOne({ bikeById: bikeId });

    if (!reviewDoc) {
      reviewDoc = new Rentbikereviews({
        bikeById: bikeId,
        allReviews: [],
      });
    }

    reviewDoc.allReviews.push({
      userById: req.userID,
      name,
      email,
      comments: message,
    });

    await reviewDoc.save();

    res.status(201).json({ message: "Review submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
