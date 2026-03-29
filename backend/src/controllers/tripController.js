const Trip = require("../models/tripModel");
const Request = require("../models/joinRequestModel");

// ✅ Create Trip
async function createTrip(req, res) {
  try {
    const { interests, ...rest } = req.body;
    let imageUrl = req.body.image;

    if (req.file && req.file.path) {
      imageUrl = req.file.path;
    }

    const trip = await Trip.create({
      ...rest,
      currentMembers: req.body.currentMembers ? Number(req.body.currentMembers) : 1,
      interests: Array.isArray(interests) ? interests : [],
      image:
        imageUrl ||
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      createdBy: req.user.id,
      participants: [],
    });

    res.status(201).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ✅ Get All Trips (excluding own + joined)
async function getAllTrips(req, res) {
  try {
    const trips = await Trip.find({
      createdBy: { $ne: req.user.id },
      participants: { $ne: req.user.id },
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: trips,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ✅ Get Trip By ID
async function getTripById(req, res) {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("participants", "name email");

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ✅ Update Trip
async function updateTrip(req, res) {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    if (trip.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const { interests, ...rest } = req.body;
    let imageUrl = req.body.image;

    if (req.file && req.file.path) {
      imageUrl = req.file.path;
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      {
        ...rest,
        currentMembers: req.body.currentMembers ? Number(req.body.currentMembers) : trip.currentMembers,
        interests: Array.isArray(interests) ? interests : trip.interests,
        image:
          imageUrl ||
          trip.image ||
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedTrip,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ✅ Delete Trip
async function deleteTrip(req, res) {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    if (
      trip.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await Request.deleteMany({ trip: trip._id });
    await trip.deleteOne();

    res.json({
      success: true,
      message: "Trip deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ✅ My Created Trips
async function getMyCreatedTrips(req, res) {
  try {
    const trips = await Trip.find({
      createdBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: trips,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ✅ My Joined Trips
async function getMyJoinedTrips(req, res) {
  try {
    const trips = await Trip.find({
      participants: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: trips,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ✅ ⭐ Upcoming Trips (YOU WANTED THIS)
async function getUpcomingTrips(req, res) {
  try {
    const today = new Date();

    const trips = await Trip.find({
      date: { $gte: today },
      participants: req.user.id,
    }).sort({ date: 1 });

    res.json({
      success: true,
      data: trips,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ✅ Recommended Trips (FIXED SAFE VERSION)
async function getRecommendedTrips(req, res) {
  try {
    const trips = await Trip.find({
      createdBy: { $ne: req.user.id },
      participants: { $ne: req.user.id },
    })
      .limit(10)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: trips,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getMyCreatedTrips,
  getMyJoinedTrips,
  getUpcomingTrips, // ⭐ NEW
  getRecommendedTrips,
};