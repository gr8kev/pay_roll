import { Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login.jsx";
import Home from "./components/Home/Home.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}
