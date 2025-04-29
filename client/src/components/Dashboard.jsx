import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState({ email: "", payment_count: 0, total_amount: 0 });
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
    return `₹${(amount / 100).toFixed(2)}`; // Convert paise to INR
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Dashboard</h2>
        <div className="space-x-4">
          <Link
            to="/"
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Prompt
          </Link>
          <Link
            to="/history"
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            View History
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
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
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-3 rounded-md">
          {error}
        </div>
      ) : (
        <>
          {/* User Details */}
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">User Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-800 font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Payments</p>
                <p className="text-gray-800 font-medium">{user.payment_count}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-gray-800 font-medium">{formatAmount(user.total_amount)}</p>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Payment History</h3>
            {payments.length === 0 ? (
              <p className="text-gray-600">No payments found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2 text-gray-800">{formatAmount(payment.amount)}</td>
                        <td className="px-4 py-2 text-gray-800">
                          {payment.payment_status === 1 ? (
                            <span className="text-green-600">Payment Successful</span>
                          ) : (
                            <span className="text-red-600">Payment Failed</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-gray-800">{formatDate(payment.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;