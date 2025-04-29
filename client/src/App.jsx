import { Routes, Route } from "react-router-dom";
import "./App.css";
import Prompt from "./components/Prompt";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/protectedRoute";
import History from "./components/History";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Prompt />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/history" element={<History />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
