const Trip = require("../models/tripModel");

async function createTrip(req,res){
  const trip = await Trip.create({
    ...req.body,
    createdBy: req.user.id,
  });
  res.status(201).json({ success: true, data: trip });
}

async function getAllTrips(req,res){
  try {
    const trips = await Trip.find({
      createdBy: { $ne: req.user._id }
    }).populate("createdBy", "name email");

    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getTripById(req,res){
  const trip = await Trip.findById(req.params.id)
    .populate("createdBy", "name email")
    .populate("participants", "name email");
  res.json({ success: true, data: trip });
}

async function updateTrip(req,res){
  const trip = await Trip.findById(req.params.id);

  if (trip.createdBy.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  const updatedTrip = await Trip.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({ success: true, data: updatedTrip });
}

async function deleteTrip(req,res){
  const trip = await Trip.findById(req.params.id);

  if (
    trip.createdBy.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  await trip.deleteOne();
  res.json({ success: true, message: "Trip deleted" });
}

async function getMyCreatedTrips(req,res){
  const trips = await Trip.find({ createdBy: req.user.id });
  res.json({ success: true, data: trips });
}

async function getMyJoinedTrips(req,res){
  const trips = await Trip.find({ participants: req.user.id });
  res.json({ success: true, data: trips });
}

module.exports = {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getMyCreatedTrips,
  getMyJoinedTrips,
};