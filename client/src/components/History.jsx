import { useState, useEffect } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

const History = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/prompt/storyList", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHistory(response.data.history);
      } catch (err) {
        console.error(err);
        setError("Failed to load history.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Story History</h2>
        <Link
          to="/"
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Back to Prompt
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
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
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {!isLoading && history.length === 0 && (
        <p className="text-gray-600">No history found.</p>
      )}

      {!isLoading && history.length > 0 && (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item._id}
              className="p-4 bg-gray-50 rounded-md border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-gray-800">
                  {item.genre.charAt(0).toUpperCase() + item.genre.slice(1)} Story
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Prompt:</strong> {item.promptText}
              </p>
              <p className="text-sm text-gray-800">
                <strong>Story:</strong> {item.responseText}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;