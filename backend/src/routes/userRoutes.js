const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// Get all users (Admin only)
router.get("/", protect, restrictTo("admin"), userController.getAllUsers);
// router.get("/", userController.getAllUsers);

// Get single public user profile
router.get("/:id", protect, userController.getUserById);

// Update logged-in user profile
router.patch("/updateme", protect, userController.updateMe);

module.exports = router;