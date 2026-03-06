const express = require("express");
const router = express.Router();

const tripController = require("../controllers/tripController");
const { protect } = require("../middleware/authMiddleware");

// Create trip
router.post("/", protect, tripController.createTrip);
// router.post("/", tripController.createTrip);

// Get all trips (with query support)
router.get("/", protect, tripController.getAllTrips);
// router.get("/", tripController.getAllTrips);

// Get my created trips
router.get("/me/created", protect, tripController.getMyCreatedTrips);
// router.get("/me/created", tripController.getMyCreatedTrips);

// Get trips I joined
router.get("/me/joined", protect, tripController.getMyJoinedTrips);
// router.get("/me/joined", tripController.getMyJoinedTrips);

// Get single trip
router.get("/:id", protect, tripController.getTripById);
// router.get("/:id", tripController.getTripById);

// Update trip (only creator check inside controller)
router.patch("/:id", protect, tripController.updateTrip);
// router.patch("/:id", tripController.updateTrip);

// Delete trip (creator or admin check inside controller)
router.delete("/:id", protect, tripController.deleteTrip);
// router.delete("/:id", tripController.deleteTrip);

module.exports = router;