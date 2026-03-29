const Request = require("../models/joinRequestModel");
const Trip = require("../models/tripModel");

// ✅ Get received requests
async function getRequests(req, res) {
  try {
    const requests = await Request.find({
      receiver: req.user.id,
      status: "pending",
    })
      .populate("trip")
      .populate("sender", "name email");

    // 🔥 Remove broken/null trips
    const validRequests = requests.filter((req) => req.trip !== null);

    res.status(200).json({
      success: true,
      data: validRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ✅ Send request
async function sendJoinRequest(req, res) {
  try {
    const tripId = req.params.tripId;

    const requestedMembers = req.body.requestedMembers ? Number(req.body.requestedMembers) : 1;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    if (trip.createdBy.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot join your own trip",
      });
    }

    if (trip.currentMembers + requestedMembers > trip.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: "Not enough spots available for this group size",
      });
    }

    const existing = await Request.findOne({
      trip: tripId,
      sender: req.user.id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Request already sent",
      });
    }

    const request = await Request.create({
      trip: trip._id,
      sender: req.user.id,
      receiver: trip.createdBy,
      requestedMembers: requestedMembers,
    });

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// ✅ Accept
async function acceptRequest(req, res) {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Already processed",
      });
    }

    const trip = await Trip.findById(request.trip);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    if (trip.currentMembers + request.requestedMembers > trip.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: "Trip cannot accommodate this specific group size (Not enough spots remaining)",
      });
    }

    const alreadyJoined = trip.participants.some(
      (p) => p.toString() === request.sender.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        message: "User already joined",
      });
    }

    request.status = "accepted";
    await request.save();

    trip.participants.push(request.sender);
    trip.currentMembers += request.requestedMembers;
    await trip.save();

    res.json({
      success: true,
      message: "Request accepted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// ✅ Reject
async function rejectRequest(req, res) {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    request.status = "rejected";
    await request.save();

    res.json({
      success: true,
      message: "Request rejected",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// ✅ Sent requests
async function getSentRequests(req, res) {
  try {
    const requests = await Request.find({
      sender: req.user.id,
    })
      .populate("trip")
      .populate("receiver", "name email");

    const validRequests = requests.filter((req) => req.trip !== null);

    res.status(200).json({
      success: true,
      data: validRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// ✅ Cancel
async function cancelRequest(req, res) {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await request.deleteOne();

    res.json({
      success: true,
      message: "Request cancelled",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  getRequests,
  sendJoinRequest,
  acceptRequest,
  rejectRequest,
  getSentRequests,
  cancelRequest,
};