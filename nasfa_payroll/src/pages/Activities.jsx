import React, { useState, useMemo, useEffect } from "react";
import { useGlobalData } from "../components/context/GlobalDataContext";

export default function Activities() {
  const { staffData, payrollData, loading } = useGlobalData();
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [toggleActivities, setToggleActivities] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("staff_toggle_activities");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setToggleActivities(parsed);
      } catch (e) {
        console.error("Failed to parse toggle activities", e);
      }
    }
  }, []);

  useEffect(() => {
    const handleToggleActivity = (event) => {
      const newActivity = event.detail;
      setToggleActivities((prev) => {
        const updated = [newActivity, ...prev];
        localStorage.setItem(
          "staff_toggle_activities",
          JSON.stringify(updated)
        );
        return updated;
      });
    };

    window.addEventListener("staffToggled", handleToggleActivity);
    return () =>
      window.removeEventListener("staffToggled", handleToggleActivity);
  }, []);

  const allActivities = useMemo(() => {
    const activities = [];

    staffData.forEach((staff) => {
      if (staff.createdAt) {
        activities.push({
          id: `staff-add-${staff._id}`,
          type: "staff_added",
          icon: "👤",
          color: "bg-green-100 text-green-700",
          title: "Personnel Added",
          description: `${staff.firstName} ${staff.lastName} was added to the system`,
          details: `Rank: ${staff.rank} | Service No: ${staff.serviceNumber}`,
          user: staff.createdBy || "Admin",
          timestamp: new Date(staff.createdAt),
          staffInfo: staff,
        });
      }

      if (staff.updatedAt && staff.updatedAt !== staff.createdAt) {
        activities.push({
          id: `staff-update-${staff._id}`,
          type: "staff_updated",
          icon: "✏️",
          color: "bg-blue-100 text-blue-700",
          title: "Personnel Updated",
          description: `${staff.firstName} ${staff.lastName}'s information was updated`,
          details: `Rank: ${staff.rank}`,
          user: "Admin",
          timestamp: new Date(staff.updatedAt),
          staffInfo: staff,
        });
      }
    });

    // Toggle activities
    toggleActivities.forEach((toggle) => {
      activities.push({
        id: toggle.id,
        type: "staff_toggled",
        icon: toggle.newStatus === "active" ? "✅" : "⏸️",
        color:
          toggle.newStatus === "active"
            ? "bg-green-100 text-green-700"
            : "bg-orange-100 text-orange-700",
        title: "Status Changed",
        description: `${toggle.staffName} status changed to ${toggle.newStatus}`,
        details: `${toggle.oldStatus} → ${toggle.newStatus} | Service No: ${toggle.serviceNumber}`,
        user: toggle.user,
        timestamp: new Date(toggle.timestamp),
        toggleInfo: toggle,
      });
    });

    // Payroll activities
    payrollData.forEach((payroll) => {
      activities.push({
        id: `payroll-${payroll._id}`,
        type: "payroll_approved",
        icon: "💰",
        color: "bg-emerald-100 text-emerald-700",
        title: "Payroll Approved",
        description: `Payroll for ${payroll.month} ${payroll.year} was approved`,
        details: `Total: ₦${payroll.totalAmount?.toLocaleString()} | ${
          payroll.personnel?.length || 0
        } personnel`,
        user: payroll.approvedBy || "Admin",
        timestamp: new Date(payroll.createdAt),
        payrollInfo: payroll,
      });
    });

    return activities.sort((a, b) => b.timestamp - a.timestamp);
  }, [staffData, payrollData, toggleActivities]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    let filtered = [...allActivities];

    if (filterType !== "all") {
      filtered = filtered.filter((a) => a.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.details?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateRange !== "all") {
      const now = new Date();
      filtered = filtered.filter((a) => {
        const diffDays = (now - a.timestamp) / (1000 * 60 * 60 * 24);
        switch (dateRange) {
          case "today":
            return diffDays < 1;
          case "week":
            return diffDays < 7;
          case "month":
            return diffDays < 30;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [allActivities, filterType, searchTerm, dateRange]);

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
    return date.toLocaleDateString();
  };

  const getActivityStats = () => {
    return {
      total: allActivities.length,
      staff_added: allActivities.filter((a) => a.type === "staff_added").length,
      staff_updated: allActivities.filter((a) => a.type === "staff_updated")
        .length,
      staff_toggled: allActivities.filter((a) => a.type === "staff_toggled")
        .length,
      payroll_approved: allActivities.filter(
        (a) => a.type === "payroll_approved"
      ).length,
    };
  };

  const stats = getActivityStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Activity Log
            </h2>
            <p className="text-gray-600 text-sm">
              Track all system activities and changes
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Activities</option>
              <option value="staff_added">Personnel Added</option>
              <option value="staff_updated">Personnel Updated</option>
              <option value="staff_toggled">Status Changed</option>
              <option value="payroll_approved">Payroll Approved</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
          <p className="text-gray-600 text-sm font-medium mb-2">
            Total Activities
          </p>
          <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-medium mb-2">
            Personnel Added
          </p>
          <p className="text-3xl font-bold text-gray-800">
            {stats.staff_added}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-emerald-500">
          <p className="text-gray-600 text-sm font-medium mb-2">
            Payrolls Approved
          </p>
          <p className="text-3xl font-bold text-gray-800">
            {stats.payroll_approved}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Activities ({filteredActivities.length})
        </h3>

        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-600 font-medium mb-2">
              No activities found
            </p>
            <p className="text-gray-500 text-sm">
              {searchTerm || filterType !== "all" || dateRange !== "all"
                ? "Try adjusting your filters"
                : "Activities will appear here as you use the system"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                onClick={() => setSelectedActivity(activity)}
                className="flex items-start gap-4 p-4 rounded-lg border hover:bg-gray-50 transition cursor-pointer"
              >
                <div
                  className={`${activity.color} rounded-full p-3 text-2xl flex-shrink-0`}
                >
                  {activity.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm">
                        {activity.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {activity.description}
                      </p>
                      {activity.details && (
                        <p className="text-gray-500 text-xs mt-1">
                          {activity.details}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {activity.user}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {activity.timestamp.toLocaleString()}
                    </span>
                    <span className="text-blue-600 text-xs font-medium">
                      Click for details →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Details Modal */}
      {selectedActivity && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedActivity(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                Activity Details
              </h3>
              <button
                onClick={() => setSelectedActivity(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div
                className={`${selectedActivity.color} rounded-lg p-4 mb-6 flex items-center gap-3`}
              >
                <span className="text-4xl">{selectedActivity.icon}</span>
                <div>
                  <h4 className="font-bold text-lg">
                    {selectedActivity.title}
                  </h4>
                  <p className="text-sm">{selectedActivity.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Performed By
                  </label>
                  <p className="text-gray-800 font-semibold mt-1">
                    {selectedActivity.user}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Date & Time
                  </label>
                  <p className="text-gray-800 font-semibold mt-1">
                    {selectedActivity.timestamp.toLocaleString()}
                  </p>
                </div>

                {selectedActivity.details && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Details
                    </label>
                    <p className="text-gray-800 mt-1">
                      {selectedActivity.details}
                    </p>
                  </div>
                )}

                {selectedActivity.toggleInfo && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600 block mb-2">
                      Status Change Information
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Previous Status</p>
                        <p className="font-semibold text-red-600 capitalize">
                          {selectedActivity.toggleInfo.oldStatus}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">New Status</p>
                        <p className="font-semibold text-green-600 capitalize">
                          {selectedActivity.toggleInfo.newStatus}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
