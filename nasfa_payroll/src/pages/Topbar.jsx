import { Menu } from "lucide-react";
import NotificationBell from "../components/Icons/Bell";

export default function Topbar({ sidebarOpen, setSidebarOpen }) {
  const user = JSON.parse(localStorage.getItem("user")) || {
    fullName: "Unknown User",
    rank: "No Rank",
    profilePicture: "",
  };

  const getInitials = (name) => {
    if (!name) return "NA";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  return (
    <div className="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Section - Menu & Welcome */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded flex-shrink-0"
          >
            <Menu size={20} />
          </button>

          <div className="hidden sm:block min-w-0">
            <h2 className="text-sm md:text-base lg:text-lg font-semibold text-gray-800 truncate">
              Welcome {user.rank} {user.fullName}
            </h2>
            <p className="text-xs text-gray-500 hidden md:block">
              Have a productive day managing your payroll
            </p>
          </div>
        </div>

        {/* Right Section - Notification & User */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-6 flex-shrink-0">
          <NotificationBell />

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right hidden lg:block">
              <p className="font-medium text-sm">{user.fullName}</p>
              <p className="text-xs text-gray-500">{user.rank}</p>
            </div>

            {/* Avatar - Show profile picture or initials */}
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.fullName}
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full object-cover border-2 border-green-600 flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-green-700 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                {getInitials(user.fullName)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Welcome Message - Shows on small screens */}
      <div className="sm:hidden mt-2 pl-11">
        <h2 className="text-sm font-semibold text-gray-800 truncate">
          Welcome {user.rank} {user.fullName}
        </h2>
      </div>
    </div>
  );
}
