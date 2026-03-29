const express = require("express");
const router = express.Router();

const tripController = require("../controllers/tripController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ✅ Apply auth middleware globally (cleaner)
router.use(protect);

// ✅ Create trip
router.post("/", upload.single('image'), tripController.createTrip);

// ✅ Get all trips
router.get("/", tripController.getAllTrips);

// ✅ Recommended trips (must be before :id)
router.get("/recommended", tripController.getRecommendedTrips);

// ✅ ⭐ Upcoming trips (NEW - you wanted this)
router.get("/me/upcoming", tripController.getUpcomingTrips);

// ✅ My created trips
router.get("/me/created", tripController.getMyCreatedTrips);

// ✅ My joined trips
router.get("/me/joined", tripController.getMyJoinedTrips);

// ✅ Get single trip
router.get("/:id", tripController.getTripById);

// ✅ Update trip
router.patch("/:id", upload.single('image'), tripController.updateTrip);

// ✅ Delete trip
router.delete("/:id", tripController.deleteTrip);

module.exports = router;