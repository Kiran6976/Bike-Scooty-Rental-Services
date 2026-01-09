const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post("/refund-payment", async (req, res) => {
  const { paymentId } = req.body;

  const refund = await razorpay.payments.refund(paymentId);

  res.json(refund);
});

module.exports = router;
