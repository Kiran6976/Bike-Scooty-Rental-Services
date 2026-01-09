const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER"
  },

  orderId: String,
  paymentId: String,
  signature: String,

  amount: Number,
  currency: String,

  status: {
    type: String,
    enum: ["created", "paid", "failed", "refunded"],
    default: "created"
  },

  items: Array,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("PAYMENT", paymentSchema);
