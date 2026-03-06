import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const TripDetails = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await API.get(`/trips/${id}`);
        setTrip(res.data.data);
      } catch (err) {
        console.log(err.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const joinTrip = async () => {
    alert("Joining trip...");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-lg text-slate-600">Loading trip details...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-lg text-slate-600">Trip not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white shadow-xl rounded-2xl p-8">

          {/* Title */}
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            {trip.title}
          </h2>

          {/* Destination */}
          <p className="text-blue-600 font-medium text-lg mb-6">
            📍 {trip.destination}
          </p>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Trip Description
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {trip.description}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Timelines(Expected)
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {trip.startDate.toString().split("T")[0]} to {trip.endDate.toString().split("T")[0]}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Budget(per person)
            </h3>
            <p className="text-slate-600 leading-relaxed">
              ₹{trip.budget} 
            </p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Maximum Participants
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {trip.maxParticipants}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Current Participants
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {trip.participants.length}
            </p>
          </div>

          {/* Join Button */}
          <button
            onClick={joinTrip}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-medium"
          >
            Join Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;