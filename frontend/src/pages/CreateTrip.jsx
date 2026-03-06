import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const CreateTrip = () => {
  const [trip, setTrip] = useState({
    title: "",
    description: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    maxParticipants: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/trips", trip);
      alert("Trip Created Successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create trip");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="flex justify-center items-center py-12 px-4">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-8">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">
            Create a New Trip
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Trip Title
              </label>
              <input
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) =>
                  setTrip({ ...trip, title: e.target.value })
                }
              />
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Destination
              </label>
              <input
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) =>
                  setTrip({ ...trip, destination: e.target.value })
                }
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Description
              </label>
              <textarea
                required
                rows="4"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none resize-none"
                onChange={(e) =>
                  setTrip({ ...trip, description: e.target.value })
                }
              />
            </div>

            {/* Dates Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Start Date(Expected)
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  onChange={(e) =>
                    setTrip({ ...trip, startDate: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  End Date(Expected)
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  onChange={(e) =>
                    setTrip({ ...trip, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Budget & Max Participants */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Budget (₹ per person)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  onChange={(e) =>
                    setTrip({ ...trip, budget: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Max Participants
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  onChange={(e) =>
                    setTrip({ ...trip, maxParticipants: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Create Trip
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;