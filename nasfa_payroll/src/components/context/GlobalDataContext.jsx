import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const GlobalDataContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useGlobalData = () => {
  const context = useContext(GlobalDataContext);
  if (!context)
    throw new Error("useGlobalData must be used within GlobalDataProvider");
  return context;
};

export const GlobalDataProvider = ({ children }) => {
  const [staffData, setStaffData] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [payrollTotal, setPayrollTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // --- Fetch Current User ---
  useEffect(() => {
    const fetchCurrentUser = () => {
      try {
        // Get user from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setCurrentUser({
            name: user.fullName,
            email: user.email || "",
            rank: user.rank,
            serviceNumber: user.serviceNumber,
            profilePicture: user.profilePicture || "",
          });
        } else {
          // Fallback
          setCurrentUser({
            name: "Admin",
            email: "admin@system.com",
            profilePicture: "",
          });
        }
      } catch (err) {
        console.error("User fetch error:", err);
        setCurrentUser({
          name: "Admin",
          email: "admin@system.com",
          profilePicture: "",
        });
      }
    };
    fetchCurrentUser();
  }, []);

  // --- Helpers ---
  const calculateEarnings = (person) => {
    const salary = person.salary || {};
    return Math.round(
      (Number(salary.conafss) || 0) +
        (Number(salary.staffGrant) || 0) +
        (Number(salary.specialForcesAllowance) || 0) +
        (Number(salary.packingAllowance) || 0)
    );
  };

  const calculateDeductions = (person) => {
    const deductions = person.deductions || {};
    return Math.round(
      (Number(deductions.electricityBill) || 0) +
        (Number(deductions.waterRate) || 0) +
        (Number(deductions.nawisDeduction) || 0) +
        (Number(deductions.benevolent) || 0) +
        (Number(deductions.quarterRental) || 0) +
        (Number(deductions.incomeTax) || 0)
    );
  };

  const calculateNetPay = (person) =>
    Math.round(calculateEarnings(person) - calculateDeductions(person));

  // --- Fetch Staff ---
  const fetchStaff = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/staff`
      );
      setStaffData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Staff fetch error:", err);
      toast.error("Error fetching staff data");
      setStaffData([]);
    }
  };

  // --- Fetch Payrolls ---
  const fetchPayrolls = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/payroll/history`
      );
      const rawPayrolls = Array.isArray(res.data.payrolls)
        ? res.data.payrolls
        : res.data;

      const payrollsNormalized = rawPayrolls.map((p) => {
        const personnel = Array.isArray(p.personnel) ? p.personnel : [];
        const totalAmount = personnel.reduce(
          (sum, person) => sum + calculateNetPay(person),
          0
        );

        return {
          ...p,
          createdAt: p.createdAt || new Date().toISOString(),
          personnel,
          totalAmount,
        };
      });

      setPayrollData(payrollsNormalized);
      setPayrollTotal(payrollsNormalized.length);
    } catch (err) {
      console.error("Payroll fetch error:", err);
      toast.error("Error fetching payroll data");
      setPayrollData([]);
      setPayrollTotal(0);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchStaff(), fetchPayrolls()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- Derived values ---
  const activePersonnel = staffData.filter((s) => s.status === "active");
  const inactivePersonnel = staffData.filter((s) => s.status === "inactive");

  const totalNetPayroll = payrollData.reduce(
    (sum, p) => sum + (p.totalAmount || 0),
    0
  );
  const totalAllowance = staffData.reduce(
    (sum, s) => sum + (Number(s.allowance) || 0),
    0
  );
  const totalEarnings = activePersonnel.reduce(
    (sum, p) => sum + calculateEarnings(p),
    0
  );
  const totalDeductions = activePersonnel.reduce(
    (sum, p) => sum + calculateDeductions(p),
    0
  );

  // --- CRUD Helpers ---
  const addStaff = (newStaff) => {
    setStaffData((prev) => [...prev, newStaff]);

    // Dispatch event for notification
    const userName = currentUser?.name || "Admin";
    window.dispatchEvent(
      new CustomEvent("staffAdded", {
        detail: {
          firstName: newStaff.firstName,
          lastName: newStaff.lastName,
          serviceNumber: newStaff.serviceNumber,
          addedBy: userName,
        },
        bubbles: true,
      })
    );
  };

  const updateStaff = (updatedStaff) =>
    setStaffData((prev) =>
      prev.map((s) =>
        String(s._id) === String(updatedStaff._id) ? updatedStaff : s
      )
    );

  const deleteStaff = async (id) => {
    try {
      const staffMember = staffData.find((s) => String(s._id) === String(id));

      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/staff/${id}`
      );
      setStaffData((prev) => prev.filter((s) => String(s._id) !== String(id)));
      toast.success("Personnel deleted successfully!");

      // Dispatch event for notification
      if (staffMember) {
        const userName = currentUser?.name || "Admin";
        window.dispatchEvent(
          new CustomEvent("staffDeleted", {
            detail: {
              staffName: `${staffMember.firstName} ${staffMember.lastName}`,
              serviceNumber: staffMember.serviceNumber,
              deletedBy: userName,
            },
            bubbles: true,
          })
        );
      }
    } catch (err) {
      console.error("Delete staff error:", err);
      toast.error(err.response?.data?.error || "Error deleting staff");
    }
  };

  // --- Toggle Status ---
  const toggleStaffStatus = async (id) => {
    try {
      const staffMember = staffData.find((s) => String(s._id) === String(id));
      if (!staffMember) {
        toast.error("Staff member not found");
        return;
      }

      const oldStatus = staffMember.status;

      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/staff/${id}/toggle-status`
      );
      const updatedStaff = res.data.data;

      // Update local state
      updateStaff(updatedStaff);
      toast.success(res.data.message);

      // Get current user info
      const userName = currentUser?.name || "Admin";
      const userEmail = currentUser?.email || "";

      // Create activity event with proper details
      const activityEvent = {
        id: `toggle-${id}-${Date.now()}`,
        type: "status_change",
        staffId: id,
        staffName: `${staffMember.firstName} ${staffMember.lastName}`,
        serviceNumber: staffMember.serviceNumber,
        oldStatus: oldStatus,
        newStatus: updatedStaff.status,
        user: userName,
        userEmail: userEmail,
        timestamp: new Date().toISOString(),
        description: `Changed status from ${oldStatus} to ${updatedStaff.status}`,
      };

      console.log("Dispatching staffToggled event:", activityEvent);

      // Dispatch the event
      window.dispatchEvent(
        new CustomEvent("staffToggled", {
          detail: activityEvent,
          bubbles: true,
        })
      );

      // Also store in localStorage as backup
      const storedActivities = JSON.parse(
        localStorage.getItem("staffActivities") || "[]"
      );
      storedActivities.unshift(activityEvent);
      // Keep only last 100 activities
      if (storedActivities.length > 100) {
        storedActivities.pop();
      }
      localStorage.setItem("staffActivities", JSON.stringify(storedActivities));
    } catch (err) {
      console.error("Toggle status error:", err);
      toast.error(err.response?.data?.error || "Error toggling status");
    }
  };

  const addPayroll = (newPayroll) => {
    setPayrollData((prev) => [newPayroll, ...prev]);

    // Dispatch event for notification
    const userName = currentUser?.name || "Admin";
    window.dispatchEvent(
      new CustomEvent("payrollCreated", {
        detail: {
          month: newPayroll.month,
          year: newPayroll.year,
          personnelCount: newPayroll.personnel?.length || 0,
          createdBy: userName,
        },
        bubbles: true,
      })
    );
  };

  const updatePayroll = (updatedPayroll) =>
    setPayrollData((prev) =>
      prev.map((p) =>
        String(p._id) === String(updatedPayroll._id) ? updatedPayroll : p
      )
    );

  const deletePayroll = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/payroll/${id}`
      );
      setPayrollData((prev) =>
        prev.filter((p) => String(p._id) !== String(id))
      );
      toast.success("Payroll deleted successfully!");
    } catch (err) {
      console.error("Delete payroll error:", err);
      toast.error(err.response?.data?.error || "Error deleting payroll");
    }
  };

  return (
    <GlobalDataContext.Provider
      value={{
        staffData,
        payrollData,
        payrollTotal,
        loading,
        currentUser,
        fetchAllData,
        addStaff,
        updateStaff,
        deleteStaff,
        toggleStaffStatus,
        addPayroll,
        updatePayroll,
        deletePayroll,
        activePersonnel,
        inactivePersonnel,
        totalNetPayroll,
        totalAllowance,
        totalEarnings,
        totalDeductions,
        calculateEarnings,
        calculateDeductions,
        calculateNetPay,
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};
