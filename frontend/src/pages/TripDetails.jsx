import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [userId, setUserId] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await API.get(`/trips/${id}`);
        setTrip(res.data?.data || null);
      } catch (err) {
        console.log(err.response?.data?.message || err.message);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await API.get("/users/me");
        setUserId(res.data?.data?._id);
      } catch (err) {
        console.log(err.response?.data?.message || err.message);
      }
    };

    const fetchRequests = async () => {
      try {
        const res = await API.get("/requests/sent");

        const existingRequest = res.data?.data?.find(
          (req) =>
            String(req.trip?._id || req.trip) === String(id)
        );

        if (existingRequest) {
          setRequestStatus(existingRequest.status);
        }
      } catch (err) {
        console.log(err.response?.data?.message || err.message);
      }
    };

    const loadData = async () => {
      await Promise.all([fetchTrip(), fetchUser(), fetchRequests()]);
      setLoading(false);
    };

    loadData();
  }, [id]);

  const joinTrip = async () => {
    const rawInput = window.prompt("How many members are joining (including yourself)?", "1");
    if (!rawInput) return; // cancelled
    
    const requestedMembers = parseInt(rawInput, 10);
    if (isNaN(requestedMembers) || requestedMembers < 1) {
      alert("Please enter a valid number greater than 0");
      return;
    }

    try {
      await API.post(`/requests/${trip._id}`, { requestedMembers });

      setRequestStatus("pending");

      // ✅ OPTIONAL: refresh trip data
      const res = await API.get(`/trips/${id}`);
      setTrip(res.data?.data || null);

      alert("Request sent successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading trip details...
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Trip not found
      </div>
    );
  }

  const startDate = new Date(trip.startDate).toISOString().split("T")[0];
  const endDate = new Date(trip.endDate).toISOString().split("T")[0];

  const isCreator =
    String(trip.createdBy?._id || trip.createdBy) === String(userId);

  const isParticipant =
    trip.participants?.some(
      (p) => String(p?._id || p) === String(userId)
    ) || false;

  const isTripFull =
    (trip.currentMembers || 1) >= trip.maxParticipants;

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6 mt-10">
        <div className="bg-white shadow-xl rounded-xl p-8">

          {/* 🔥 Featured Image */}
          <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden mb-8">
            <img 
              src={trip.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"} 
              alt={trip.title} 
              className="w-full h-full object-cover" 
            />
          </div>

          <h1 className="text-3xl font-bold mb-2">{trip.title}</h1>
          <p className="text-blue-600 text-lg mb-4">
            📍 {trip.destination}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full capitalize">
              {trip.status} Trip
            </span>
            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full capitalize">
              {trip.budgetRange} Budget
            </span>
          </div>

          <div className="space-y-5">
            {trip.createdBy && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Organized By</h3>
                <p className="text-gray-600 flex items-center gap-2">
                  👤 {trip.createdBy.name || "Unknown"}
                  <span className="text-sm text-gray-400">({trip.createdBy.email || "No email provided"})</span>
                </p>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-700">Description</h3>
              <p className="text-gray-600">{trip.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">Trip Dates</h3>
              <p className="text-gray-600">
                {startDate} → {endDate}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">
                Budget (per person)
              </h3>
              <p className="text-gray-600">₹{trip.budget}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">
                Available Slots
              </h3>
              <p className="text-gray-600">
                {Math.max(0, trip.maxParticipants - (trip.currentMembers || 1))} spots left ({(trip.currentMembers || 1)}/{trip.maxParticipants})
              </p>
            </div>

            {trip.interests && trip.interests.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Activities & Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {trip.interests.map((interest, index) => (
                    <span key={index} className="bg-slate-200 text-slate-700 text-xs font-medium px-3 py-1 rounded-full">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            {isCreator ? (
              <button
                onClick={() => navigate(`/edit-trip/${trip._id}`)}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600"
              >
                Edit Trip
              </button>
            ) : isParticipant ? (
              <button
                disabled
                className="bg-green-500 text-white px-6 py-3 rounded-lg cursor-not-allowed"
              >
                Joined
              </button>
            ) : requestStatus === "pending" ? (
              <button
                disabled
                className="bg-orange-500 text-white px-6 py-3 rounded-lg cursor-not-allowed"
              >
                Request Sent
              </button>
            ) : isTripFull ? (
              <button
                disabled
                className="bg-red-500 text-white px-6 py-3 rounded-lg cursor-not-allowed"
              >
                Trip Full
              </button>
            ) : (
              <button
                onClick={joinTrip}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Join Trip
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TripDetails;