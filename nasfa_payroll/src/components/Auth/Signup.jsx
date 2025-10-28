import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import officer from "../../assets/officer.jpg";
import { toast, Toaster } from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    rank: "",
    serviceNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      // eslint-disable-next-line no-unused-vars
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/signup`,
        formData
      );

      toast.success("Signup successful!");
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err);
      const errorMessage =
        err.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-6 px-4">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row shadow-lg rounded-xl overflow-hidden">
        {/* Left Image */}
        <div className="md:w-1/2">
          <img
            src={officer}
            alt="Army Officer"
            className="w-full h-full object-cover max-h-[600px] md:max-h-[780px]"
          />
        </div>

        {/* Right Form */}
        <div className="md:w-1/2 flex items-center justify-center bg-white p-8 md:p-12">
          <div className="w-full max-w-md">
            {/* Top Right - Sign in link */}
            <div className="flex justify-end mb-6 md:mb-12">
              <p className="text-gray-600 text-sm mr-3">
                Already have an account?
              </p>
              <Link to="/">
                <button className="border border-gray-400 text-sm px-4 py-1.5 rounded-lg hover:bg-gray-100">
                  Sign in
                </button>
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="w-full">
              <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                Officer Signup
              </h2>
              <p className="text-gray-500 mb-6">
                Please provide accurate details to register.
              </p>

              {error && (
                <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-3">
                  {error}
                </div>
              )}

              {/* Input Fields */}
              {[
                {
                  label: "Full Name",
                  name: "fullName",
                  type: "text",
                  placeholder: "Enter your full name",
                },
                {
                  label: "Rank / Designation",
                  name: "rank",
                  type: "text",
                  placeholder: "e.g. Captain, Major",
                },
                {
                  label: "Service Number",
                  name: "serviceNumber",
                  type: "text",
                  placeholder: "Enter your service number",
                },
                {
                  label: "Official Email",
                  name: "email",
                  type: "email",
                  placeholder: "Enter your official email",
                },
              ].map((field) => (
                <div className="mb-4" key={field.name}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full mt-1 border border-gray-300 bg-[#F4F4F4] rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-700 focus:outline-none"
                    required
                  />
                </div>
              ))}

              {/* Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full mt-1 border border-gray-300 bg-[#F4F4F4] rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-700 focus:outline-none"
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

              {/* Confirm Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="w-full mt-1 border border-gray-300 bg-[#F4F4F4] rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-700 focus:outline-none"
                    required
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative w-full flex items-center justify-center bg-green-700 text-white py-3 rounded-lg font-medium hover:bg-green-800 transition"
              >
                {loading ? "Submitting..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
