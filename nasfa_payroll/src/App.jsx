import { Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login.jsx";
import Dashboard from "./components/Home/dashboard.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}
