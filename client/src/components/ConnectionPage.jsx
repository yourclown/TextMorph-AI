import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import Header from "./Header";

const ConnectionsPage = () => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await axios.get("/users/me/following", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFollowing(response.data.following);
      } catch (err) {
        console.error("Error fetching following:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowing();
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 p-6">
      <Header />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8 mt-7">
          People You Follow
        </h1>

        {loading ? (
          <div className="animate-pulse space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-800/50 rounded-xl"></div>
            ))}
          </div>
        ) : (
          <ul className="space-y-4">
            {following.map(user => (
              <li 
                key={user._id}
                className="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-cyan-400/20 p-4 shadow-2xl shadow-cyan-500/10 hover:border-cyan-400/40 transition-all"
              >
                <Link to={`/profile/${user._id}`} className="text-cyan-400 hover:text-cyan-300">
                  {user.email}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;