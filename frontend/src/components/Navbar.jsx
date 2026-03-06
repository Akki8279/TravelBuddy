import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
          TravelBuddy
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/dashboard"
            className="text-slate-700 hover:text-blue-600 transition"
          >
            Dashboard
          </Link>

          <Link
            to="/created-trips"
            className="text-slate-700 hover:text-blue-600 transition"
          >
            Created Trips
          </Link>

          <Link
            to="/dashboard"
            className="text-slate-700 hover:text-blue-600 transition"
          >
            My Requests
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-slate-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-4 bg-white">
          <Link
            to="/dashboard"
            className="block text-slate-700 hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>

          <Link
            to="/my-trips"
            className="block text-slate-700 hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            Created Trips
          </Link>

          <Link
            to="/my-requests"
            className="block text-slate-700 hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            My Requests
          </Link>

          <button
            onClick={logout}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;