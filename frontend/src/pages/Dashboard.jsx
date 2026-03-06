import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await API.get("/trips");
        setTrips(res.data);
      } catch (error) {
        console.log(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
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
            All Trips
          </h2>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/create-trip")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create Trip
            </button>
            
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center text-slate-500 text-lg">
            Loading trips...
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center text-slate-500 text-lg">
            No trips available
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

                <Link to={`/trip/${trip._id}`} className="mt-4">
                  <button className="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-900 transition">
                    View Details
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;