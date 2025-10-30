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
    serviceNumber: "",
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

      localStorage.setItem(
        "user",
        JSON.stringify({
          fullName: res.data.fullName,
          rank: res.data.rank,
          serviceNumber: res.data.serviceNumber,
          profilePicture: res.data.profilePicture || "",
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
    <div className="min-h-screen h-screen flex flex-col md:flex-row overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex items-center gap-2 bg-white md:bg-transparent px-3 py-2 md:p-0 rounded-lg md:rounded-none shadow-md md:shadow-none">
        <p className="text-gray-600 text-xs md:text-sm">
          Don't have an account?
        </p>
        <Link to="/signup">
          <button className="border border-gray-400 text-xs md:text-sm px-3 md:px-4 py-1 md:py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            Sign up
          </button>
        </Link>
      </div>

      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <img
          src={officer}
          alt="Army Officer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="flex-1 md:w-1/2 bg-white overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="flex justify-start mb-6 sm:mb-8">
              <img
                src={logo}
                alt="Army Logo"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
              />
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
              Sign in
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-8">
              Sign in with your service number and password
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Service Number
                </label>
                <input
                  type="text"
                  name="serviceNumber"
                  placeholder="Enter service number"
                  value={formData.serviceNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 bg-[#F4F4F4] rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-green-600 focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 bg-[#F4F4F4] rounded-lg px-3 py-2 pr-10 text-sm sm:text-base focus:ring-2 focus:ring-green-600 focus:outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`relative w-full flex items-center justify-center ${
                  loading ? "bg-gray-400" : "bg-green-700 hover:bg-green-800"
                } text-white py-2.5 sm:py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed text-sm sm:text-base mt-6 sm:mt-8`}
              >
                {loading ? "Signing in..." : "Sign in"}
                {!loading && (
                  <svg
                    className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2"
                    width="10"
                    height="10"
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

            <div className="mt-6 text-center">
              <a
                href="#"
                className="text-xs sm:text-sm text-gray-600 hover:text-green-700 transition-colors"
              >
                Forgot your password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
