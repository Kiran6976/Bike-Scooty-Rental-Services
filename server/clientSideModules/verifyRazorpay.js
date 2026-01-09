const express = require("express");
const crypto = require("crypto");
const Payment = require("../models/paymentSchema");

const router = express.Router();

router.post("/verify-razorpay", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      amount,
      userId
    } = req.body;

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // ❌ If signature does NOT match → fail
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // ✅ Save payment
    await Payment.create({
      userId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      items,
      amount,
      currency: "INR",
      status: "paid"
    });

    // ✅ Respond success
    res.status(200).json({ success: true });

  } catch (err) {
    console.error("Verify Razorpay Error:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
