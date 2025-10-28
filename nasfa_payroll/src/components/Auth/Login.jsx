import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import officer from "../../assets/officer.jpg";
import logo from "../../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        formData
      );

      toast.success("Login successful!");
      localStorage.setItem("token", res.data.access_token);
      // After a successful login:
      localStorage.setItem(
        "user",
        JSON.stringify({
          fullName: res.data.fullName, // backend should return this
          rank: res.data.rank,
        })
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.msg || "Login failed");
      } else {
        toast.error("Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-6 px-4">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Top Right - Signup */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
        <p className="text-gray-600 text-sm">Don't have an account?</p>
        <Link to="/signup">
          <button className="border border-gray-400 text-sm px-4 py-1.5 rounded-lg hover:bg-gray-100">
            Sign up
          </button>
        </Link>
      </div>

      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row shadow-lg rounded-xl overflow-hidden">
        {/* Image Panel */}
        <div className="hidden md:block md:w-2/5">
          <img
            src={officer}
            alt="Army Officer"
            className="w-full h-full object-cover max-h-[500px]"
          />
        </div>

        {/* Form Panel */}
        <div className="w-full md:w-3/5 flex items-center justify-center bg-white p-8 md:p-12">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex justify-start mb-6">
              <img
                src={logo}
                alt="Army Logo"
                className="w-16 h-16 rounded-full"
              />
            </div>

            {/* Title */}
            <h2 className="text-3xl font-semibold text-gray-900 mb-2">
              Sign in
            </h2>
            <p className="text-gray-500 mb-6">
              Sign in with your registered email and password
            </p>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Official Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter official email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 bg-[#F4F4F4] rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-300 bg-[#F4F4F4] rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className={`relative w-full flex items-center justify-center ${
                  loading ? "bg-gray-400" : "bg-green-700 hover:bg-green-800"
                } text-white py-3 rounded-lg font-medium transition`}
              >
                {loading ? "Signing in..." : "Sign in"}
                {!loading && (
                  <svg
                    className="absolute right-5 top-1/2 -translate-y-1/2"
                    width="11"
                    height="11"
                    viewBox="0 0 11 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.9688 0.5V8.625C10.9688 8.74932 10.9194 8.86855 10.8315 8.95646C10.7436 9.04436 10.6243 9.09375 10.5 9.09375C10.3757 9.09375 10.2565 9.04436 10.1686 8.95646C10.0807 8.86855 10.0313 8.74932 10.0313 8.625V1.63125L0.831276 10.8313C0.742417 10.9141 0.624888 10.9591 0.50345 10.957C0.382012 10.9548 0.266146 10.9056 0.180262 10.8198C0.0943793 10.7339 0.0451844 10.618 0.0430418 10.4966C0.0408991 10.3751 0.085976 10.2576 0.168776 10.1687L9.36878 0.96875H2.37503C2.25071 0.96875 2.13148 0.919364 2.04357 0.831456C1.95566 0.743548 1.90628 0.62432 1.90628 0.5C1.90628 0.37568 1.95566 0.256451 2.04357 0.168544C2.13148 0.080636 2.25071 0.03125 2.37503 0.03125H10.5C10.6243 0.03125 10.7436 0.080636 10.8315 0.168544C10.9194 0.256451 10.9688 0.37568 10.9688 0.5Z"
                      fill="white"
                    />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
