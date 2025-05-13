import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";


const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

    useEffect(() => {
      document.title = "Login";
    }, []);
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful!");
      setTimeout(() => navigate("/feeds"), 1500); // Redirect after showing success message
    } catch (err) {
      setMessage(err.response?.data?.msg || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
   const handleGoogleSuccess = async credentialResponse => {
    try {
      // send the ID token to your backend
      const res = await axios.post("/auth/google", {
        id_token: credentialResponse.credential
      });
      localStorage.setItem("token", res.data.token);
      // redirect
      navigate("/feeds");
    } catch (err) {
      console.error("Google login failed", err);
      setMessage("Google login failed");
    }
  };

  const handleGoogleError = () => {
    setMessage("Google sign-in failed. Please try again.");
  };
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black/30 backdrop-blur-lg rounded-2xl border border-cyan-400/20 p-8 shadow-2xl shadow-cyan-500/20">
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-cyan-400/80 font-mono text-sm">
            Access your story generation portal
          </p>
          <div className="mt-4">
            <Link 
              to="/register" 
              className="text-cyan-400 hover:text-cyan-300 text-sm font-mono transition-all"
            >
              Not registered? <span className="underline">Create account</span>
            </Link>
          </div>
        </div>

        {message && (
          <div className={`mt-6 p-3 rounded-lg border ${
            message.includes("success") 
              ? "border-green-400/30 bg-green-400/10 text-green-400" 
              : "border-red-400/30 bg-red-400/10 text-red-400"
          }`}>
            {message}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative group">
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-black/30 border-2 border-cyan-400/20 rounded-lg text-cyan-100 font-mono placeholder-cyan-400/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
              />
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 bg-gradient-to-r from-cyan-400/30 to-transparent transition-opacity pointer-events-none" />
            </div>

            <div className="relative group">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 bg-black/30 border-2 border-cyan-400/20 rounded-lg text-cyan-100 font-mono placeholder-cyan-400/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 bg-gradient-to-r from-cyan-400/30 to-transparent transition-opacity pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-cyan-400 border-2 border-cyan-400/50 rounded focus:ring-cyan-400/30"
              />
              <span className="text-cyan-400/80 text-sm font-mono">Remember me</span>
            </label>
            <Link 
              to="/forgot-password" 
              className="text-cyan-400/80 hover:text-cyan-300 text-sm font-mono transition-all"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all ${
              isLoading ? 'opacity-80 cursor-not-allowed' : ''
            } shadow-lg hover:shadow-2xl hover:shadow-cyan-500/30`}
          >
            <span className="font-bold text-gray-900 text-sm">
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                'ACCESS PORTAL'
              )}
            </span>
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cyan-400/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black/30 text-cyan-400/80 font-mono">
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <div className="hover:scale-105 transition-transform">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_black"
                size="medium"
                shape="pill"
                logo_alignment="center"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;