const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    // ✅ Profile
    avatar: {
      type: String,
      default: ""
    },

    bio: {
      type: String,
      default: ""
    },

    // 🔥 NEW: Interests (VERY IMPORTANT)
    interests: {
      type: [String],
      default: []
    },

    // 🔥 NEW: Budget preference
    budgetRange: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },

    // ✅ Ratings
    ratings: {
      type: Number,
      default: 0
    },

    totalReviews: {
      type: Number,
      default: 0
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    isBlocked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);