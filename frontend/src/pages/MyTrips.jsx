import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleDelete(tripId) {
    if (window.confirm("Are you sure you want to delete this trip?")) { 
      API.delete(`/trips/${tripId}`)
        .then(() => {
          setTrips((prevTrips) => prevTrips.filter((trip) => trip._id !== tripId));
        })
        .catch((error) => {
          console.log(error.response?.data?.message);
          alert("Failed to delete the trip. Please try again.");
        });
      }
  }

  useEffect(() => {
    const fetchMyTrips = async () => {
      try {
        const res = await API.get("/trips/me/created");
        // console.log(res.data.data);
        setTrips(res.data.data);
      } catch (error) {
        console.log(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTrips();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-slate-800">
            My Created Trips
          </h2>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-slate-600 text-white px-5 py-2 rounded-lg hover:bg-slate-700 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center text-slate-500 text-lg">
            Loading your trips...
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center text-slate-500 text-lg">
            You haven’t created any trips yet.
          </div>
        ) : (
          /* Trip Cards Grid */
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <div
                key={trip._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    {trip.title}
                  </h3>

                  <p className="text-sm text-blue-600 font-medium mb-2">
                    📍 {trip.destination}
                  </p>

                  <p className="text-slate-600 text-sm line-clamp-3">
                    {trip.description}
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <Link to={`/trip/${trip._id}`} className="w-full">
                    <button className="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-900 transition">
                      View Details
                    </button>
                  </Link>

                  <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                    onClick={() => handleDelete(trip._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;