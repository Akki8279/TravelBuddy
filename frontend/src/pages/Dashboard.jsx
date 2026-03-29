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

        // ✅ FIX: match backend response
        setTrips(res.data?.data || []);
        
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h2 className="text-3xl font-bold text-slate-800">
            Explore Trips ✈️
          </h2>

          <button
            onClick={() => navigate("/create-trip")}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition shadow"
          >
            + Create Trip
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center text-slate-500 text-lg">
            Loading trips...
          </div>
        ) : !trips || trips.length === 0 ? (
          <div className="text-center text-slate-500 text-lg">
            No trips available
          </div>
        ) : (

          /* GRID */
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <div
                key={trip._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden group"
              >

                {/* IMAGE */}
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={
                      trip.image ||
                      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                    }
                    alt="trip"
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-5 flex flex-col justify-between h-55">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-1">
                      {trip.title}
                    </h3>

                    <p className="text-sm text-blue-600 font-medium mb-2">
                      📍 {trip.destination}
                    </p>

                    <p className="text-slate-600 text-sm line-clamp-2">
                      {trip.description}
                    </p>
                  </div>

                  {/* FOOTER */}
                  <div className="mt-4 flex justify-between items-center">

                    {/* Budget Badge */}
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        trip.budgetRange === "low"
                          ? "bg-green-100 text-green-600"
                          : trip.budgetRange === "medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {trip.budgetRange || "medium"}
                    </span>

                    <Link to={`/trip/${trip._id}`}>
                      <button className="bg-slate-800 text-white px-4 py-1.5 rounded-lg hover:bg-black transition text-sm">
                        View
                      </button>
                    </Link>

                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;