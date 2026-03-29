const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    },

    // ✅ Track how many seats this request represents (e.g. sender + their offline friends)
    requestedMembers: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    }
  },
  { timestamps: true }
);

// ✅ Prevent duplicate requests
requestSchema.index({ trip: 1, sender: 1 }, { unique: true });

// ✅ Query performance
requestSchema.index({ receiver: 1 });
requestSchema.index({ sender: 1 });

// 🔥 NEW: Prevent self-request (IMPORTANT)
requestSchema.pre("save", function () {
  if (this.sender.toString() === this.receiver.toString()) {
    throw new Error("You cannot send request to yourself");
  }
});

module.exports = mongoose.model("Request", requestSchema);