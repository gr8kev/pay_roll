import React, { useMemo } from "react";
import { useGlobalData } from "../components/context/GlobalDataContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ToastContainer } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const COLORS = [
  "#16a34a",
  "#15803d",
  "#22c55e",
  "#4ade80",
  "#86efac",
  "#a7f3d0",
];

const Dashboard = () => {
  const {
    staffData,
    payrollData,
    loading,
    totalDeductions,
    totalNetPayroll,
    totalEarnings,
    calculateNetPay,
  } = useGlobalData();

  const safeFormat = (value) =>
    typeof value === "number" && !isNaN(value) ? value.toLocaleString() : "0";

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";

    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // ======================= COMPUTED DATA =========================
  const { stats, payrollTrend, recentActivities } = useMemo(() => {
    const staff = Array.isArray(staffData) ? staffData : [];
    const payrolls = Array.isArray(payrollData) ? payrollData : [];

    const totalPersonnel = staff.length;
    const activePersonnel = staff.filter(
      (s) => s.status?.toLowerCase() === "active"
    ).length;
    const inactivePersonnel = totalPersonnel - activePersonnel;

    // Last 6 months
    const last6Months = Array.from({ length: 6 })
      .map((_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return {
          month: date.toLocaleString("en-US", { month: "long" }),
          year: date.getFullYear(),
        };
      })
      .reverse();

    // Payroll trend with totalNetPay per month
    const payrollTrendData = last6Months.map(({ month, year }) => {
      const payroll = payrolls.find(
        (p) => p.month === month && p.year === year
      );
      const totalNetPay = payroll?.personnel
        ? payroll.personnel.reduce((sum, p) => sum + calculateNetPay(p), 0)
        : 0;

      return {
        name: `${month.substring(0, 3)} ${year}`,
        totalNetPay,
        personnelCount: payroll?.personnel?.length ?? 0,
      };
    });

    // Corps Distribution
    const corpsCounts = {};
    staff.forEach((s) => {
      const corps = s.corps || "Unassigned";
      corpsCounts[corps] = (corpsCounts[corps] || 0) + 1;
    });
    const corpsChart = Object.entries(corpsCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // Recent Activities
    const activities = [];
    payrolls.slice(0, 3).forEach((p) => {
      activities.push({
        type: "payroll",
        message: `Payroll approved for ${p.month} ${p.year}`,
        amount: p.personnel
          ? p.personnel.reduce((sum, per) => sum + calculateNetPay(per), 0)
          : 0,
        time: formatTimeAgo(p.createdAt),
        icon: "💰",
      });
    });

    const recentStaff = [...staff]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 3);

    recentStaff.forEach((s) => {
      activities.push({
        type: "staff",
        message: `${s.firstName} ${s.lastName} added to personnel`,
        time: formatTimeAgo(s.createdAt),
        icon: "👤",
      });
    });

    return {
      stats: {
        totalPersonnel,
        activePersonnel,
        inactivePersonnel,
        totalDeductions,
        totalNetPayroll,
        totalEarnings,
      },
      payrollTrend: payrollTrendData,
      corpsData: corpsChart,
      recentActivities: activities.slice(0, 5),
    };
  }, [
    staffData,
    payrollData,
    totalDeductions,
    totalNetPayroll,
    totalEarnings,
    calculateNetPay,
  ]);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  // ======================= RENDER =========================
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-center" theme="colored" />

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
        </div>
      ) : (
        <motion.div
          className="space-y-8"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.15 }}
        >
          {/* === Summary Stats === */}
          <motion.div
            className="grid md:grid-cols-5 sm:grid-cols-2 gap-4"
            variants={fadeUp}
          >
            {[
              {
                label: "Total Personnel",
                value: stats.totalPersonnel,
                color: "bg-green-600 ",
              },
              {
                label: "Active Personnel",
                value: stats.activePersonnel,
                color: "bg-green-500",
              },
              {
                label: "Inactive Personnel",
                value: stats.inactivePersonnel,
                color: "bg-gray-500",
              },
              {
                label: "Total Deductions",
                value: `₦${safeFormat(stats.totalDeductions)}`,
                color: "bg-red-600",
              },
              {
                label: "Total Net Payroll",
                value: `₦${safeFormat(stats.totalNetPayroll)}`,
                color: "bg-emerald-600",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={`${item.color} text-white rounded-2xl p-4 text-center shadow`}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <h3 className="text-lg font-medium">{item.label}</h3>
                <p className="text-2xl font-bold mt-1">{item.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* === Payroll Trend Bar Chart === */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow mt-10"
            variants={fadeUp}
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Payroll Trend (Last 6 Months)
            </h3>
            {payrollTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={payrollTrend}
                  margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: "#4b5563" }} />
                  <YAxis tick={{ fill: "#4b5563" }} />
                  <Tooltip
                    formatter={(value, name, props) => {
                      const data = props.payload;
                      return [
                        `₦${safeFormat(data.totalNetPay)}`,
                        `${data.name} | ${data.personnelCount} personnel`,
                      ];
                    }}
                    contentStyle={{
                      backgroundColor: "#f9fafb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="totalNetPay"
                    name="Total Net Payroll"
                    radius={[8, 8, 0, 0]}
                  >
                    {payrollTrend.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-500">
                <p>No payroll history available</p>
              </div>
            )}
          </motion.div>

          {/* === Recent Activities === */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow mt-10"
            variants={fadeUp}
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Recent Activities
            </h3>
            {recentActivities.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentActivities.map((a, i) => (
                  <motion.li
                    key={i}
                    className="flex items-center justify-between py-3"
                    variants={fadeUp}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{a.icon}</span>
                      <div>
                        <p className="text-gray-800">{a.message}</p>
                        <p className="text-sm text-gray-500">{a.time}</p>
                      </div>
                    </div>
                    {a.amount && (
                      <span className="text-green-600 font-semibold">
                        ₦{safeFormat(a.amount)}
                      </span>
                    )}
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recent activities</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
