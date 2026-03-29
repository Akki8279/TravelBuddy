const User = require("../models/userModel");

// ✅ Get current user
async function getMe(req, res) {
  res.status(200).json({
    success: true,
    data: req.user,
  });
}

// ✅ Get all users (ADMIN ONLY ideally)
async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password");

    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// ✅ Get single user
async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// ✅ Update logged-in user (SAFE VERSION)
async function updateMe(req, res) {
  try {
    // 🚨 Prevent dangerous updates
    const restrictedFields = ["password", "role", "isBlocked"];
    restrictedFields.forEach((field) => delete req.body[field]);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  getMe,
  getAllUsers,
  getUserById,
  updateMe,
};