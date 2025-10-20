import { Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login.jsx";
import Dashboard from "./components/Home/dashboard.jsx";
import Signup from "./components/Auth/Signup.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}
