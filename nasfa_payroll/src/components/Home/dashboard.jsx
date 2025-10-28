import React, { useState, useEffect } from "react";
import Sidebar from "../../pages/Sidebar";
import Topbar from "../../pages/Topbar";
import DashboardContent from "../../pages/DashboardContent";
import Staff from "../../pages/Staff";
import Pay from "../../pages/Pay";
import PayrollHistory from "../../pages/PayrollHistory";
import ReportsAnalytics from "../../pages/Reports";
import Activities from "../../pages/Activities";

export default function Dashboard() {
  // Load the saved menu from localStorage, or default to "Dashboard"
  const [activeMenu, setActiveMenu] = useState(() => {
    const savedMenu = localStorage.getItem("activeMenu");
    return savedMenu || "Dashboard";
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Save activeMenu to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("activeMenu", activeMenu);
  }, [activeMenu]);

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return <DashboardContent />;
      case "Staff Management":
        return <Staff />;
      case "Payroll Management":
        return <Pay />;
      case "Payroll Calendar":
        return <PayrollHistory />;
      case "Reports & Analytics":
        return <ReportsAnalytics />;
      case "Recent Activities":
        return <Activities />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        sidebarOpen={sidebarOpen}
      />
      <div className="flex-1 flex flex-col">
        <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 overflow-auto p-6">{renderContent()}</div>
      </div>
    </div>
  );
}
