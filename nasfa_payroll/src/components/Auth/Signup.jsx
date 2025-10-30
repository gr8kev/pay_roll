import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Camera, X } from "lucide-react";
import axios from "axios";
import officer from "../../assets/officer.jpg";
import { toast, Toaster } from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
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
      const payload = {
        ...formData,
        profilePicture: profileImage || "",
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/signup`,
        payload
      );

      toast.success("Signup successful!");

      if (res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
      }

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Signup error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.msg ||
        "Signup failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-screen flex flex-col md:flex-row overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Sign in Link - Floating on mobile, fixed on desktop */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex items-center gap-2 bg-white md:bg-transparent px-3 py-2 md:p-0 rounded-lg md:rounded-none shadow-md md:shadow-none">
        <p className="text-gray-600 text-xs md:text-sm">
          Already have an account?
        </p>
        <Link to="/">
          <button className="border border-gray-400 text-xs md:text-sm px-3 md:px-4 py-1 md:py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            Sign in
          </button>
        </Link>
      </div>

      {/* Left Side - Image */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <img
          src={officer}
          alt="Army Officer"
          className="w-full h-full object-cover"
        />
        {/* Optional overlay for better text visibility if you add any */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 md:w-1/2 bg-white overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="w-full">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-gray-500 text-sm sm:text-base mb-6">
                Please provide accurate details to register.
              </p>

              {error && (
                <div className="bg-red-100 text-red-600 text-xs sm:text-sm p-2 rounded mb-4">
                  {error}
                </div>
              )}

              {/* Profile Picture Upload */}
              <div className="mb-4 flex justify-center">
                <div className="relative">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-green-600"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="profile-upload"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-300 border-2 border-dashed border-gray-400 transition-colors"
                    >
                      <Camera
                        size={20}
                        className="sm:w-6 sm:h-6 text-gray-600"
                      />
                      <span className="text-xs text-gray-600 mt-1">Upload</span>
                    </label>
                  )}
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mb-5">
                Profile Picture (Optional - Max 5MB)
              </p>

              {/* Input Fields */}
              <div className="space-y-3 sm:space-y-4">
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
                  <div key={field.name}>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      name={field.name}
                      type={field.type}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-300 bg-[#F4F4F4] rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-green-700 focus:outline-none transition-all"
                      required
                    />
                  </div>
                ))}

                {/* Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className="w-full border border-gray-300 bg-[#F4F4F4] rounded-lg px-3 py-2 pr-10 text-sm sm:text-base focus:ring-2 focus:ring-green-700 focus:outline-none transition-all"
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className="w-full border border-gray-300 bg-[#F4F4F4] rounded-lg px-3 py-2 pr-10 text-sm sm:text-base focus:ring-2 focus:ring-green-700 focus:outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-green-700 text-white py-2.5 sm:py-3 rounded-lg font-medium hover:bg-green-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
