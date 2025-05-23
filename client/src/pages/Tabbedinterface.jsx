import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation and useNavigate
import Prompt from "./prompt";
import Event from "./Event";

const TabbedInterface = () => {
  const location = useLocation(); // Get the current location object
  const navigate = useNavigate(); // Get the navigate function

  // Determine initial active tab based on the URL path
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname === "/create-event") {
      return "event";
    }
    // Default to 'prompt' if the path is '/create' or anything else
    return "prompt";
  });

  // Use useEffect to update activeTab if the URL changes (e.g., direct navigation)
  useEffect(() => {
    if (location.pathname === "/create-event") {
      setActiveTab("event");
    } else if (location.pathname === "/create") {
      setActiveTab("prompt");
    }
  }, [location.pathname]); // Re-run when location.pathname changes


  const handleTabClick = (tabName, path) => {
    setActiveTab(tabName);
    navigate(path); // Change the URL
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 ">
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "prompt"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabClick("prompt", "/create")}
        >
          Prompt
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "event"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabClick("event", "/create-event")}
        >
          Create Event
        </button>
      </div>
      <div className="mt-4">
        {activeTab === "prompt" && <Prompt />}
        {activeTab === "event" && <Event />}
      </div>
    </div>
  );
};

export default TabbedInterface;