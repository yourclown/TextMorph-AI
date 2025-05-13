import { Routes, Route } from "react-router-dom";
import "./App.css";
import Prompt from "./pages/prompt";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/protectedRoute";
import History from "./components/History";
import Dashboard from "./components/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResetPassword from "./components/ResetPassword";
import Landing from "./components/landingPage";
import PostPage from "./components/postPage";
import ProfilePage from "./components/ProfilePage";
import ConnectionsPage from "./components/ConnectionPage";
import Navigation from "./components/navigation";
import Footer from "./components/Footer";
import DashboardLayout from "./components/Dashboard";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-blue-900">
      {/* Navigation is conditionally rendered */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route
          path="*"
          element={
            <>
              <Navigation />
              <main className="flex-1 md:ml-64 p-4 pt-20 md:pt-4 transition-all duration-300">
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  toastClassName="bg-gray-800/30 backdrop-blur-lg border border-cyan-400/20"
                  bodyClassName="text-cyan-100"
                />
                <Routes>
                  {/* Public routes */}

                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* Protected routes */}
                  <Route>
                    <Route path="/create" element={<Prompt />} />
                    <Route path="/dashboard" element={<DashboardLayout />} />
                    <Route path="/myprofile" element={<ProfilePage />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/feeds" element={<PostPage />} />
                    <Route path="/profile/:userId" element={<ProfilePage />} />
                    <Route path="/connections" element={<ConnectionsPage />} />
                  </Route>
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
