const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// ✅ Auth routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// ✅ Current user (better naming than /profile)
router.get("/me", protect, authController.getProfile);

// ✅ Optional: logout (handled on frontend usually)
router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;