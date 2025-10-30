import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Activity,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import NairaIcon from "../components/Icons/NairaIcon";

export default function Sidebar({ activeMenu, setActiveMenu, sidebarOpen }) {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard Overview", icon: LayoutDashboard },
    { name: "Payroll Management", icon: NairaIcon },
    { name: "Payroll Calendar", icon: Calendar },
    { name: "Staff Management", icon: Users },
    { name: "Recent Activities", icon: Activity },
    { name: "Reports & Analytics", icon: BarChart3 },
    // { name: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-gray-50 border-r border-gray-200 transition-all duration-300 flex flex-col`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        <img
          src={logo}
          alt="NASFA Logo"
          className="w-8 h-8 rounded-full object-cover"
        />
        {sidebarOpen && (
          <h1 className="text-sm font-bold text-gray-800">NASFA Payroll</h1>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => setActiveMenu(item.name)}
              className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                activeMenu === item.name
                  ? "bg-green-600 text-white border-r-4 border-green-700"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Icon size={20} />
              {sidebarOpen && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-gray-700 hover:bg-gray-200 px-4 py-3 rounded transition-colors"
        >
          <LogOut size={20} />
          {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}
