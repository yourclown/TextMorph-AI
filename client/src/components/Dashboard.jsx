import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link, Outlet } from "react-router-dom";
import Header from "./Header";
import Navigation from "./navigation";

const DashboardLayout = () => {
  const [user, setUser] = useState({
    email: "",
    payment_count: 0,
    total_amount: 0,
  });
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Dashboard";
    const fetchPaymentHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/user/payment-history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data.user);
        setPayments(response.data.payments);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching payment history:", err);
        setError("Failed to load dashboard data.");
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  const formatAmount = (amount) => {
    return `₹${(amount / 100).toFixed(2)}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 flex flex-col">
      <Header />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid  gap-8">
            {/* Navigation Sidebar */}

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="animate-pulse text-cyan-400 text-lg mb-4">
                    INITIALIZING USER PROTOCOL...
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
              ) : error ? (
                <div className="p-6 border border-purple-400/30 bg-purple-400/10 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="text-purple-400 text-2xl">⚠️</div>
                    <div className="text-purple-200 font-mono">{error}</div>
                  </div>
                </div>
              ) : (
                <>
                  {/* User Details Card */}
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-cyan-400/20 p-8 shadow-2xl shadow-cyan-500/10">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6">
                      My Profile Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 bg-black/30 rounded-lg border border-cyan-400/10">
                        <p className="text-cyan-400/70 font-mono text-sm">
                          EMAIL SIGNATURE
                        </p>
                        <p className="text-cyan-200 font-bold mt-2">
                          {user.email}
                        </p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg border border-cyan-400/10">
                        <p className="text-cyan-400/70 font-mono text-sm">
                          TRANSACTION COUNT
                        </p>
                        <p className="text-cyan-200 font-bold mt-2">
                          {user.payment_count}
                        </p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg border border-cyan-400/10">
                        <p className="text-cyan-400/70 font-mono text-sm">
                          TOTAL FUNDS PROCESSED
                        </p>
                        <p className="text-cyan-200 font-bold mt-2">
                          {formatAmount(user.total_amount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment History Card */}
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-blue-400/20 p-8 shadow-2xl shadow-blue-500/10">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
                      Payment Records
                    </h3>
                    {payments.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32">
                        <div className="text-cyan-400/50 text-6xl mb-2">⎯</div>
                        <p className="text-cyan-400/70 font-mono">
                          NO TRANSACTIONS FOUND
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {payments.map((payment, index) => (
                          <div
                            key={index}
                            className="p-4 bg-black/30 rounded-lg border border-cyan-400/10 hover:border-cyan-400/40 transition-all"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-cyan-400/70 font-mono text-sm">
                                  AMOUNT
                                </p>
                                <p className="text-cyan-200">
                                  {formatAmount(payment.amount)}
                                </p>
                              </div>
                              <div>
                                <p className="text-cyan-400/70 font-mono text-sm">
                                  STATUS
                                </p>
                                <p
                                  className={
                                    payment.payment_status === 1
                                      ? "text-green-400 font-bold animate-pulse"
                                      : "text-red-400 font-bold"
                                  }
                                >
                                  {payment.payment_status === 1
                                    ? "✓ SUCCESS"
                                    : "✗ FAILED"}
                                </p>
                              </div>
                              <div>
                                <p className="text-cyan-400/70 font-mono text-sm">
                                  DATE
                                </p>
                                <p className="text-cyan-200 font-mono">
                                  {formatDate(payment.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
