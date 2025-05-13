import React, { useState, Fragment, Component } from "react";
import axios from "../api/axios";
import { Dialog, Transition } from "@headlessui/react";
import Header from "./Header";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center text-purple-400 font-mono p-8">
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message || "Please try again later."}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await axios.post("/auth/reset-password", { email });
      setSuccess(response.data.message);
      setIsOtpDialogOpen(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await axios.post("/auth/verify-otp", {
        email,
        otp,
        newPassword,
        confirmPassword,
      });

      setSuccess(response.data.message);
      setIsOtpDialogOpen(false);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-gray-800 rounded-xl border border-cyan-400/20 p-8 shadow-2xl shadow-cyan-500/10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6 text-center">
            Reset Password
          </h1>

          {/* Email Form */}
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div>
              <label className="text-cyan-200 font-mono">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-cyan-200 border border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter your email"
                required
              />
            </div>
            {error && <p className="text-purple-400 font-mono">{error}</p>}
            {success && !isOtpDialogOpen && (
              <p className="text-cyan-400 font-mono">{success}</p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 border border-cyan-400 rounded-lg font-bold text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>

          {/* OTP Dialog */}
          <Transition appear show={isOtpDialogOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-10"
              onClose={() => setIsOtpDialogOpen(false)}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/50" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-gray-800 border border-cyan-400/20 p-6 text-left align-middle shadow-xl shadow-cyan-500/10 transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
                      >
                        Verify OTP
                      </Dialog.Title>
                      <form
                        onSubmit={handleVerifyOTP}
                        className="mt-4 space-y-4"
                      >
                        <div>
                          <label className="text-cyan-200 font-mono">OTP</label>
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-cyan-200 border border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Enter OTP"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-cyan-200 font-mono">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-cyan-200 border border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Enter new password"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-cyan-200 font-mono">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-cyan-200 border border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Confirm new password"
                            required
                          />
                        </div>
                        {error && (
                          <p className="text-purple-400 font-mono">{error}</p>
                        )}
                        <div className="mt-6 flex justify-end space-x-4">
                          <button
                            type="button"
                            onClick={() => setIsOtpDialogOpen(false)}
                            className="px-4 py-2 border border-gray-400 rounded-lg font-bold text-gray-400 hover:bg-gray-400/10 transition-all duration-300"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 border border-cyan-400 rounded-lg font-bold text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 disabled:opacity-50"
                          >
                            {isLoading ? "Verifying..." : "Reset Password"}
                          </button>
                        </div>
                      </form>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ResetPassword;
