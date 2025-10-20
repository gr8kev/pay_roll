import { Link } from "react-router-dom";
import officer from "../../assets/officer.jpg";

export default function Signup() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side - Image (Hidden on Mobile) */}
      <div className="hidden md:block md:w-1/2 p-2 md:h-auto">
        <img
          src={officer}
          alt="Army Officer"
          className="w-full h-[770px] object-cover rounded-r-xl"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 py-10 relative">
        {/* Top Right - Already Have Account */}
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <p className="text-gray-600 text-sm">Already have an account?</p>
          <Link to="/">
            <button className="border border-gray-400 text-sm px-4 py-1.5 rounded-lg hover:bg-gray-100">
              Sign in
            </button>
          </Link>
        </div>

        {/* Form Content */}
        <div className="max-w-md w-full">
          {/* Title */}
          <h2 className="text-3xl font-[500] text-gray-900 mb-2">
            Sign up to access
          </h2>
          <p className="text-gray-500 mb-6">
            Sign up with your Google account or use the form
          </p>

          {/* First Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your first name"
                className="w-full mt-1 border border-gray-300 bg-[#F4F4F4] rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">↗</span>
            </div>
          </div>

          {/* Middle Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Middle name
            </label>
            <input
              type="text"
              placeholder="Enter your middle name"
              className="w-full mt-1 border border-gray-300 bg-[#F4F4F4] rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Last name
            </label>
            <input
              type="text"
              placeholder="Enter your last name"
              className="w-full mt-1 border border-gray-300 bg-[#F4F4F4] rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>

          {/* Army & ID Numbers */}
          <div className="mb-4 flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Army number
              </label>
              <p className="text-xs text-gray-500 mb-1">
                Enter your army number
              </p>
              <input
                type="text"
                placeholder="Enter Army number"
                className="w-full border border-gray-300 bg-[#F4F4F4] rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                I.D number
              </label>
              <p className="text-[0.65rem] tracking-[120%] text-gray-500 mb-1">
                This will identify your tier and access level.
              </p>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter I.D / Tier number"
                  className="w-full border border-gray-300 bg-[#F4F4F4] rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
                />
                <span className="absolute right-3 top-2.5 text-gray-400 cursor-pointer">
                  👁️
                </span>
              </div>
            </div>
          </div>

          {/* Department */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select className="w-full mt-1 border border-gray-300 bg-[#F4F4F4] rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none">
              <option>Select department</option>
              <option>Operations</option>
              <option>Logistics</option>
              <option>Medical</option>
            </select>
          </div>

          {/* Region */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Region
            </label>
            <select className="w-full mt-1 border border-gray-300 bg-[#F4F4F4] rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none">
              <option>Select region</option>
              <option>North</option>
              <option>South</option>
              <option>East</option>
              <option>West</option>
            </select>
          </div>

          {/* Type of work */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700">
              Type of work assigned
            </label>
            <select className="w-full mt-1 border border-gray-300 bg-[#F4F4F4] rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none">
              <option>Select region</option>
              <option>Administrative</option>
              <option>Field</option>
              <option>Technical</option>
            </select>
          </div>

          {/* Add Staff Button */}
          <button className="relative w-full flex items-center justify-center bg-green-700 text-white py-3 rounded-lg font-medium hover:bg-green-800 transition">
            <span>Add Staff</span>
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
          </button>
        </div>
      </div>
    </div>
  );
}
