import React, { useState, useEffect, useRef } from "react";
import { Bell, X, Check, CheckCheck } from "lucide-react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notifications") || "[]");
    setNotifications(stored);
    updateUnreadCount(stored);
  }, []);

  // Listen for new notifications from staff toggle events
  useEffect(() => {
    const handleStaffToggled = (event) => {
      const activity = event.detail;
      const notification = {
        id: `notif-${Date.now()}`,
        type: "status_change",
        title: "Staff Status Changed",
        message: `${activity.staffName}'s status changed from ${activity.oldStatus} to ${activity.newStatus}`,
        timestamp: activity.timestamp,
        read: false,
        icon: "👤",
        user: activity.user,
      };
      addNotification(notification);
    };

    const handlePayrollCreated = (event) => {
      const payroll = event.detail;
      const notification = {
        id: `notif-${Date.now()}`,
        type: "payroll_created",
        title: "New Payroll Generated",
        message: `Payroll for ${payroll.month} ${payroll.year} has been created with ${payroll.personnelCount} personnel`,
        timestamp: new Date().toISOString(),
        read: false,
        icon: "💰",
        user: payroll.createdBy || "System",
      };
      addNotification(notification);
    };

    const handleStaffAdded = (event) => {
      const staff = event.detail;
      const notification = {
        id: `notif-${Date.now()}`,
        type: "staff_added",
        title: "New Staff Added",
        message: `${staff.firstName} ${staff.lastName} (${staff.serviceNumber}) has been added to the system`,
        timestamp: new Date().toISOString(),
        read: false,
        icon: "✅",
        user: staff.addedBy || "System",
      };
      addNotification(notification);
    };

    const handleStaffDeleted = (event) => {
      const staff = event.detail;
      const notification = {
        id: `notif-${Date.now()}`,
        type: "staff_deleted",
        title: "Staff Removed",
        message: `${staff.staffName} (${staff.serviceNumber}) has been removed from the system`,
        timestamp: new Date().toISOString(),
        read: false,
        icon: "🗑️",
        user: staff.deletedBy || "System",
      };
      addNotification(notification);
    };

    window.addEventListener("staffToggled", handleStaffToggled);
    window.addEventListener("payrollCreated", handlePayrollCreated);
    window.addEventListener("staffAdded", handleStaffAdded);
    window.addEventListener("staffDeleted", handleStaffDeleted);

    return () => {
      window.removeEventListener("staffToggled", handleStaffToggled);
      window.removeEventListener("payrollCreated", handlePayrollCreated);
      window.removeEventListener("staffAdded", handleStaffAdded);
      window.removeEventListener("staffDeleted", handleStaffDeleted);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const updateUnreadCount = (notifs) => {
    const count = notifs.filter((n) => !n.read).length;
    setUnreadCount(count);
  };

  const addNotification = (notification) => {
    setNotifications((prev) => {
      const updated = [notification, ...prev].slice(0, 50); // Keep only last 50
      localStorage.setItem("notifications", JSON.stringify(updated));
      updateUnreadCount(updated);
      return updated;
    });
  };

  const markAsRead = (id) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      localStorage.setItem("notifications", JSON.stringify(updated));
      updateUnreadCount(updated);
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem("notifications", JSON.stringify(updated));
      updateUnreadCount(updated);
      return updated;
    });
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      localStorage.setItem("notifications", JSON.stringify(updated));
      updateUnreadCount(updated);
      return updated;
    });
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      setNotifications([]);
      localStorage.removeItem("notifications");
      setUnreadCount(0);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "status_change":
        return "border-l-blue-500";
      case "payroll_created":
        return "border-l-green-500";
      case "staff_added":
        return "border-l-emerald-500";
      case "staff_deleted":
        return "border-l-red-500";
      default:
        return "border-l-gray-500";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell size={20} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[70vh] sm:max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-xs sm:text-sm text-green-600">
                  ({unreadCount} new)
                </span>
              )}
            </h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
                  title="Mark all as read"
                >
                  <CheckCheck size={14} />
                  <span className="hidden sm:inline">Mark all read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-6 sm:p-8 text-center">
                <Bell
                  size={40}
                  className="sm:w-12 sm:h-12 mx-auto text-gray-300 mb-3"
                />
                <p className="text-gray-500 text-sm">No notifications yet</p>
                <p className="text-gray-400 text-xs mt-1">
                  You'll see updates here when actions occur
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 sm:p-4 hover:bg-gray-50 transition-colors border-l-4 ${getNotificationColor(
                      notif.type
                    )} ${!notif.read ? "bg-blue-50" : ""}`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="text-xl sm:text-2xl flex-shrink-0">
                        {notif.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-xs sm:text-sm text-gray-800 break-words">
                              {notif.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1 break-words">
                              {notif.message}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(notif.timestamp)}
                              </span>
                              <span className="text-xs text-gray-400">
                                by {notif.user}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {!notif.read && (
                              <button
                                onClick={() => markAsRead(notif.id)}
                                className="p-1 hover:bg-green-100 rounded transition-colors"
                                title="Mark as read"
                              >
                                <Check size={14} className="text-green-600" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notif.id)}
                              className="p-1 hover:bg-red-100 rounded transition-colors"
                              title="Delete"
                            >
                              <X size={14} className="text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
