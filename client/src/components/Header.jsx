import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import axios from "../api/axios";

const Header = () => {
  const [credits, setCredits] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const postsLinkText =
    location.pathname === "/feeds" ? "Create Post/Tool" : "Story feeds";
  const postsLinkRoute = location.pathname === "/feeds" ? "/create" : "/feeds";

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("/user/get-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCredits(response.data.credits);
        setUsername(response.data.username);
        setEmail(response.data.email);
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
    // In either case, clear the client state:
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 to-blue-900 border-b border-cyan-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - App Name */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              TextMorph-AI
            </span>
          </Link>

          {/* Right Side - User Info and Navigation */}
          <div className="flex items-center space-x-6">
            {/* User Info */}

            {/* Navigation Tabs */}
            <div className="flex space-x-4">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/40 transition-all duration-300 ${
                    isActive ? "bg-cyan-400/20 border-cyan-400" : ""
                  }`
                }
              >
                {/* <LayoutDashboard size={20} />/ */}
                <span className="font-semibold">Dashboard</span>
              </NavLink>
              <Link
                to="/create"
                className="px-4 py-2 border border-cyan-400/30 rounded-lg text-cyan-400 hover:bg-cyan-400/10 transition-all"
              >
                Create Post {/* Use the conditional text here */}
              </Link>

              <Link
                to="/reset-password"
                className="px-4 py-2 border border-cyan-400/30 rounded-lg text-cyan-400 hover:bg-cyan-400/10 transition-all"
              >
                Reset Password
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-red-400/30 rounded-lg text-red-400 hover:bg-red-400/10 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
