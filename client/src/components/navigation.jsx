import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Clock,
  User,
  LogOut,
  Edit,
  Play,
} from "react-feather";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import axios from "../api/axios";

const Navigation = () => {
  const [credits, setCredits] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState({ username: "", email: "" });

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("/user/get-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCredits(response.data.credits);
        setUsername(response.data.username);
        setUser({
          username: response.data.username,
          email: response.data.email,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (err) {
      console.warn("Logout API failed:", err);
    }
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-gray-800/30 backdrop-blur-lg border-r border-cyan-400/20 p-6 fixed h-screen hidden md:block z-50">
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {user.username || "User"}
          </h2>
          <p className="text-sm text-cyan-400/70">{user.email || "No email"}</p>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Navigation
          </h2>
        </div>
        <nav className="space-y-4">
          <NavLink
            to="/feeds"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/40 transition-all duration-300 ${
                isActive ? "bg-cyan-400/20 border-cyan-400" : ""
              }`
            }
          >
            <User size={20} />
            <span className="font-semibold">My Feeds</span>
          </NavLink>
             <NavLink
            to="/event-feeds"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/40 transition-all duration-300 ${
                isActive ? "bg-cyan-400/20 border-cyan-400" : ""
              }`
            }
          >
            <Play size={20} />
            <span className="font-semibold">Events feeds</span>
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/40 transition-all duration-300 ${
                isActive ? "bg-cyan-400/20 border-cyan-400" : ""
              }`
            }
          >
            {/* <LayoutDashboard size={20} />/ */}
            <span className="font-semibold">Create Post</span>
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/40 transition-all duration-300 ${
                isActive ? "bg-cyan-400/20 border-cyan-400" : ""
              }`
            }
          >
            <Clock size={20} />
            <span className="font-semibold">History</span>
          </NavLink>
          <NavLink
            to="/myprofile"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/40 transition-all duration-300 ${
                isActive ? "bg-cyan-400/20 border-cyan-400" : ""
              }`
            }
          >
            <User size={20} />
            <span className="font-semibold">My Profile</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 rounded-lg border border-red-400/30 text-red-400 hover:bg-red-400/10 hover:border-red-400/40 transition-all duration-300 w-full text-left"
          >
            <LogOut size={20} />
            <span className="font-semibold">Logout</span>
          </button>
        </nav>
      </aside>

      <div className="md:hidden fixed w-full z-50 bg-gray-900/80 backdrop-blur-lg border-b border-cyan-400/20">
        <button
          onClick={() =>
            document.getElementById("mobile-sidebar").classList.toggle("hidden")
          }
          className="p-2 bg-cyan-400/20 rounded-lg text-cyan-400"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
      <aside
        id="mobile-sidebar"
        className="hidden md:hidden bg-gray-800/90 backdrop-blur-lg w-64 p-6 fixed h-screen z-40 transform -translate-x-full transition-transform duration-300 ease-in-out"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {user.username || "User"}
          </h2>
          <p className="text-sm text-cyan-400/70">{user.email || "No email"}</p>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Navigation
          </h2>
        </div>
        <nav className="space-y-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/40 transition-all duration-300 ${
                isActive ? "bg-cyan-400/20 border-cyan-400" : ""
              }`
            }
            onClick={() =>
              document.getElementById("mobile-sidebar").classList.add("hidden")
            }
          >
            {/* <LayoutDashboard size={20} /> */}
            <span className="font-semibold">Dashboard</span>
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/40 transition-all duration-300 ${
                isActive ? "bg-cyan-400/20 border-cyan-400" : ""
              }`
            }
            onClick={() =>
              document.getElementById("mobile-sidebar").classList.add("hidden")
            }
          >
            {/* <LayoutDashboard size={20} /> */}
            <span className="font-semibold">Create Post</span>
          </NavLink>
          <NavLink
            to="/feeds"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/40 transition-all duration-300 ${
                isActive ? "bg-cyan-400/20 border-cyan-400" : ""
              }`
            }
            onClick={() =>
              document.getElementById("mobile-sidebar").classList.add("hidden")
            }
          >
            {/* <LayoutDashboard size={20} /> */}
            <span className="font-semibold">feeds</span>
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/40 transition-all duration-300 ${
                isActive ? "bg-cyan-400/20 border-cyan-400" : ""
              }`
            }
            onClick={() =>
              document.getElementById("mobile-sidebar").classList.add("hidden")
            }
          >
            <Clock size={20} />
            <span className="font-semibold">History</span>
          </NavLink>
          <NavLink
            to="/myprofile"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/40 transition-all duration-300 ${
                isActive ? "bg-cyan-400/20 border-cyan-400" : ""
              }`
            }
            onClick={() =>
              document.getElementById("mobile-sidebar").classList.add("hidden")
            }
          >
            <User size={20} />
            <span className="font-semibold">My Profile</span>
          </NavLink>
          <button
            onClick={() => {
              handleLogout();
              document.getElementById("mobile-sidebar").classList.add("hidden");
            }}
            className="flex items-center space-x-3 p-3 rounded-lg border border-red-400/30 text-red-400 hover:bg-red-400/10 hover:border-red-400/40 transition-all duration-300 w-full text-left"
          >
            <LogOut size={20} />
            <span className="font-semibold">Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Navigation;
