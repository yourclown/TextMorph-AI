import { useEffect, useState } from "react";
import axios from "../api/axios";
import { QRCodeSVG } from "qrcode.react"; 

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/events/my-events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data.events);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching registered events:", err);
        setError("Failed to load your registered events.");
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-6">
        <svg
          className="animate-spin h-8 w-8 text-blue-600 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="text-gray-600 mt-2">Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-3 rounded-md">{error}</div>;
  }

 return (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 p-6">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8">
        REGISTERED EVENTS
      </h2>

      {events.length === 0 ? (
        <div className="text-center p-8 border border-cyan-400/20 rounded-xl bg-gray-800/30">
          <p className="text-cyan-400/80 font-mono">
            NO ACTIVE REGISTRATIONS FOUND
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div 
              key={event.registrationId}
              className="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-cyan-400/20 p-6 shadow-2xl shadow-cyan-500/10 hover:border-cyan-400/40 transition-all"
            >
              <h3 className="text-xl font-bold text-cyan-400 mb-2">
                {event.name}
              </h3>

              <div className="space-y-2 mb-4">
                <p className="text-cyan-400/80 font-mono text-sm">
                  <span className="text-cyan-400">DATE:</span>{" "}
                  {new Date(event.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-cyan-400/80 font-mono text-sm">
                  <span className="text-cyan-400">LOCATION:</span> {event.location}
                </p>
              </div>

              <p className="text-cyan-200 font-mono text-sm leading-relaxed mb-6">
                {event.description}
              </p>

              <div className="mt-4 border-t border-cyan-400/20 pt-4">
                <p className="text-cyan-400/80 font-mono text-sm mb-3">
                  CHECK-IN IDENTIFIER
                </p>
                <div className="p-4 bg-black/30 rounded-lg border border-cyan-400/20">
                  <div className="flex justify-center">
                    <QRCodeSVG
                      value={event.registrationToken}
                      size={128}
                      bgColor="#1a202c"  // Dark background
                      fgColor="#22d3ee"  // Cyan color
                      level="H"
                    />
                  </div>
                </div>
                <p className="text-cyan-400/60 font-mono text-xs mt-3 text-center">
                  Scan at event venue for verification
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
};

export default MyEvents;