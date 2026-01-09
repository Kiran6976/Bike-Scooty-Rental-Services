const express = require("express");
const Payment = require("../models/paymentSchema");
const authenticate = require("../middelware/authenticate");

const router = express.Router();

router.get("/my-payments", authenticate, async (req, res) => {
  const payments = await Payment.find({ userId: req.userID });
  res.json(payments);
});

module.exports = router;
