import { useState, useEffect } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import Navigation from "./navigation";
import Header from "./Header";

const History = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3;

  useEffect(() => {
    document.title = "History";
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const params = new URLSearchParams({
          page,
          limit,
          search: searchText,
          genre: selectedGenre,
        });
        const response = await axios.get(`/prompt/storyList?${params}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHistory(response.data.history);
        setTotalPages(response.data.pages);
      } catch (err) {
        console.error(err);
        setError("Failed to load history.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [page, searchText, selectedGenre]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 flex">
      <div className="max-w-6xl mx-auto space-y-8 card">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            History
          </h1>
          <Link
            to="/create"
            className="px-6 py-3 border border-cyan-400 rounded-lg font-bold text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 hover:scale-105"
          >
            <span className="drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
              RETURN TO GENERATOR
            </span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <input
            type="text"
            placeholder="Search by input or output text..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-800 text-cyan-200 border border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full md:w-1/2"
          />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-800 text-cyan-200 border border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full md:w-1/4"
          >
            <option value="">All Genres</option>
            <option value="horror">Horror</option>
            <option value="creative">Creative</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
          </select>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-pulse text-cyan-400 text-lg mb-4">
              ACCESSING MEMORY BANKS...
            </div>
            <svg
              className="animate-spin h-12 w-12 text-cyan-400"
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
          <div className="p-6 border border-purple-400/30 bg-purple-400/10 rounded-xl">
            <div className="flex items-center space-x-4">
              <div className="text-purple-400 text-2xl">⚠️</div>
              <div className="text-purple-200 font-mono">{error}</div>
            </div>
          </div>
        )}

        {!isLoading && history.length === 0 && (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="text-cyan-400/50 text-6xl mb-4">⎯</div>
            <p className="text-cyan-400/70 font-mono">
              NO MATCHING NARRATIVES FOUND
            </p>
          </div>
        )}

        {!isLoading && history.length > 0 && (
          <div className="space-y-6">
            {history.map((item) => (
              <div
                key={item._id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-cyan-400/20 p-6 shadow-2xl shadow-cyan-500/10 hover:border-cyan-400/40 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {item.genre.toUpperCase()}
                  </h3>
                  <p className="text-cyan-400/60 font-mono text-sm">
                    {new Date(item.createdAt).toLocaleString([], {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-black/30 rounded-lg border border-cyan-400/10">
                    <p className="text-cyan-300 font-mono text-sm">
                      <span className="text-cyan-400">INPUT:</span>{" "}
                      {item.promptText}
                    </p>
                  </div>

                  <div className="p-4 bg-black/30 rounded-lg border border-blue-400/10">
                    <p className="text-cyan-100 font-mono text-sm">
                      <span className="text-blue-400">OUTPUT:</span>{" "}
                      {item.responseText}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-4 py-2 border border-cyan-400 rounded-lg font-bold text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-cyan-400 font-mono">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="px-4 py-2 border border-cyan-400 rounded-lg font-bold text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default History;
