const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    destination: {
      type: String,
      required: true,
      trim: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    budget: {
      type: Number,
      default: 0,
      min: 0
    },

    // ✅ Budget category
    budgetRange: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },

    // ✅ Interests for matching
    interests: {
      type: [String],
      default: []
    },

    // ✅ Image with fallback (IMPORTANT FIX)
    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming"
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    maxParticipants: {
      type: Number,
      required: true,
      min: 1
    },

    // ✅ Track how many people are currently in the trip (offline + accepted joins)
    currentMembers: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },

    // ✅ Expense tracking
    expenses: [
      {
        title: {
          type: String,
          trim: true
        },
        amount: {
          type: Number,
          min: 0
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);