const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

// ✅ Get full inbox of recent conversations
router.get("/conversations", protect, messageController.getConversations);

// ✅ Get chat history with a specific user
router.get("/:userId", protect, messageController.getMessages);

module.exports = router;
