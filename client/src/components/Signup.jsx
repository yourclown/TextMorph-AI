import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";

const Signup = () => {
  const [form, setForm] = useState({ 
    email: "", 
    password: "",
    confirmPassword: "" 
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

    useEffect(() => {
      document.title = "Signup";
    }, []);
  
    
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Password confirmation check
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    setIsLoading(true);

    try {
      const res = await axios.post("/auth/signup", {
        email: form.email,
        password: form.password
      });
      console.log("Signup successful:", res.data);
      navigate("/login", { 
        state: { 
          message: "Registration successful! Please log in.",
          type: "success"
        } 
      });
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black/30 backdrop-blur-lg rounded-2xl border border-cyan-400/20 p-8 shadow-2xl shadow-cyan-500/20">
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            CREATE ACCOUNT
          </h2>
          <p className="text-cyan-400/80 font-mono text-sm">
            Join our story generation network
          </p>
          <div className="mt-4">
            <Link 
              to="/login" 
              className="text-cyan-400 hover:text-cyan-300 text-sm font-mono transition-all"
            >
              Already registered? <span className="underline">Sign in</span>
            </Link>
          </div>
        </div>
  
        {error && (
          <div className="mt-6 p-3 rounded-lg border border-red-400/30 bg-red-400/10 text-red-400">
            <p className="text-sm">{error}</p>
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
                minLength="6"
                className="w-full px-4 py-3 bg-black/30 border-2 border-cyan-400/20 rounded-lg text-cyan-100 font-mono placeholder-cyan-400/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                placeholder="Password (min 6 characters)"
                value={form.password}
                onChange={handleChange}
              />
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 bg-gradient-to-r from-cyan-400/30 to-transparent transition-opacity pointer-events-none" />
            </div>
  
            <div className="relative group">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full px-4 py-3 bg-black/30 border-2 border-cyan-400/20 rounded-lg text-cyan-100 font-mono placeholder-cyan-400/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 bg-gradient-to-r from-cyan-400/30 to-transparent transition-opacity pointer-events-none" />
            </div>
          </div>
  
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-cyan-400 border-2 border-cyan-400/50 rounded focus:ring-cyan-400/30"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-cyan-400/80 font-mono">
                I agree to the{' '}
                <Link to="/terms" className="text-cyan-400 hover:text-cyan-300 underline">
                  Terms and Conditions
                </Link>
              </label>
            </div>
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
                  <span>INITIALIZING...</span>
                </div>
              ) : (
                'CREATE ACCOUNT'
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
                SECURE CONNECTION
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signup;