const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const { protect } = require("../middleware/authMiddleware");

// ✅ Get received requests
router.get("/received", protect, requestController.getRequests);

// ✅ Get sent requests
router.get("/sent", protect, requestController.getSentRequests);

// ✅ Send join request
router.post("/:tripId", protect, requestController.sendJoinRequest);

// ✅ Accept request
router.patch("/:id/accept", protect, requestController.acceptRequest);

// ✅ Reject request
router.patch("/:id/reject", protect, requestController.rejectRequest);

// ✅ Cancel request
router.delete("/:id", protect, requestController.cancelRequest);

module.exports = router;