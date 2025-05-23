import { useState } from "react";
import axios from "../api/axios";

const Event = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const eventData = { name, date, location, description };
      await axios.post("/events", eventData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Event created successfully!");
      setName("");
      setDate("");
      setLocation("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setMessage("Error creating event.");
    }
  };

 return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 p-6">
      <div className="max-w-3xl mx-auto bg-gray-800/30 backdrop-blur-lg rounded-2xl border border-cyan-400/20 p-8 shadow-2xl shadow-cyan-500/10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8">
          CREATE EVENT
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <label className="block text-sm font-mono text-cyan-400/80 mb-2">
              EVENT NAME
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-black/30 border-2 border-cyan-400/20 rounded-lg text-cyan-100 font-mono placeholder-cyan-400/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 bg-gradient-to-r from-cyan-400/30 to-transparent transition-opacity pointer-events-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group">
              <label className="block text-sm font-mono text-cyan-400/80 mb-2">
                EVENT DATE
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 bg-black/30 border-2 border-cyan-400/20 rounded-lg text-cyan-100 font-mono placeholder-cyan-400/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 bg-gradient-to-r from-cyan-400/30 to-transparent transition-opacity pointer-events-none" />
            </div>

            <div className="relative group">
              <label className="block text-sm font-mono text-cyan-400/80 mb-2">
                LOCATION
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-black/30 border-2 border-cyan-400/20 rounded-lg text-cyan-100 font-mono placeholder-cyan-400/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 bg-gradient-to-r from-cyan-400/30 to-transparent transition-opacity pointer-events-none" />
            </div>
          </div>

          <div className="relative group">
            <label className="block text-sm font-mono text-cyan-400/80 mb-2">
              EVENT DESCRIPTION
            </label>
            <textarea
              rows="4"
              className="w-full px-4 py-3 bg-black/30 border-2 border-cyan-400/20 rounded-lg text-cyan-100 font-mono placeholder-cyan-400/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 bg-gradient-to-r from-cyan-400/30 to-transparent transition-opacity pointer-events-none" />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg hover:shadow-2xl hover:shadow-cyan-500/30"
          >
            <span className="font-bold text-gray-900 text-sm">
              INITIALIZE EVENT
            </span>
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-3 rounded-lg border ${
            message.includes("success") 
              ? "border-green-400/30 bg-green-400/10 text-green-400" 
              : "border-red-400/30 bg-red-400/10 text-red-400"
          }`}>
            <p className="font-mono text-sm">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Event;