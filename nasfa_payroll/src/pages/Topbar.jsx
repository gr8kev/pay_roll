import React from "react";
import { Bell, Search, Menu } from "lucide-react";

export default function Topbar({ sidebarOpen, setSidebarOpen }) {
  const user = JSON.parse(localStorage.getItem("user")) || {
    fullName: "Unknown User",
    rank: "No Rank",
  };

  const getInitials = (name) => {
    if (!name) return "NA";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <Menu size={20} />
        </button>

        <div className="relative hidden md:block">
          <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search within the Dashboard"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Bell
          size={20}
          className="text-gray-600 cursor-pointer hover:text-gray-800"
        />

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-medium text-sm">{user.fullName}</p>
            <p className="text-xs text-gray-500">{user.rank}</p>
          </div>
          <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white font-bold">
            {getInitials(user.fullName)}
          </div>
        </div>
      </div>
    </div>
  );
}
