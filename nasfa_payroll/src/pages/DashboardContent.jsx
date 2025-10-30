import React, { useMemo, useState } from "react";
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
  LineChart,
  Line,
} from "recharts";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const COLORS = [
  "#16a34a",
  "#15803d",
  "#22c55e",
  "#4ade80",
  "#86efac",
  "#a7f3d0",
  "#bbf7d0",
  "#dcfce7",
  "#10b981",
  "#059669",
  "#047857",
  "#065f46",
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

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartType, setChartType] = useState("bar"); // 'bar' or 'line'

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
  const { stats, payrollTrend, recentActivities, availableYears } =
    useMemo(() => {
      const staff = Array.isArray(staffData) ? staffData : [];
      const payrolls = Array.isArray(payrollData) ? payrollData : [];

      const totalPersonnel = staff.length;
      const activePersonnel = staff.filter(
        (s) => s.status?.toLowerCase() === "active"
      ).length;
      const inactivePersonnel = totalPersonnel - activePersonnel;

      // Get all years from payroll data
      const years = [...new Set(payrolls.map((p) => p.year))].sort(
        (a, b) => b - a
      );
      const yearsAvailable =
        years.length > 0 ? years : [new Date().getFullYear()];

      // All 12 months
      const allMonths = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Payroll trend for selected year (all 12 months)
      const payrollTrendData = allMonths.map((month) => {
        const payroll = payrolls.find(
          (p) => p.month === month && p.year === selectedYear
        );
        const totalNetPay = payroll?.personnel
          ? payroll.personnel.reduce((sum, p) => sum + calculateNetPay(p), 0)
          : 0;

        return {
          name: month.substring(0, 3),
          fullName: month,
          totalNetPay,
          personnelCount: payroll?.personnel?.length ?? 0,
          year: selectedYear,
        };
      });

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
        recentActivities: activities.slice(0, 5),
        availableYears: yearsAvailable,
      };
    }, [
      staffData,
      payrollData,
      totalDeductions,
      totalNetPayroll,
      totalEarnings,
      calculateNetPay,
      selectedYear,
    ]);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  // ======================= RENDER =========================
  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-center" theme="colored" />

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
        </div>
      ) : (
        <motion.div
          className="space-y-6 md:space-y-8"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.15 }}
        >
          {/* === Summary Stats === */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4"
            variants={fadeUp}
          >
            {[
              {
                label: "Total Personnel",
                value: stats.totalPersonnel,
                color: "bg-green-600",
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
                className={`${item.color} text-white rounded-xl md:rounded-2xl p-4 md:p-5 text-center shadow hover:shadow-lg transition-shadow`}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <h3 className="text-sm md:text-base lg:text-lg font-medium">
                  {item.label}
                </h3>
                <p className="text-xl md:text-2xl font-bold mt-1 break-words">
                  {item.value}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* === Payroll Trend Chart === */}
          <motion.div
            className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow"
            variants={fadeUp}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-700">
                Payroll Trend - {selectedYear}
              </h3>
              <div className="flex flex-wrap gap-2">
                {/* Year Selector */}
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                {/* Chart Type Selector */}
                <div className="flex gap-1 border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setChartType("bar")}
                    className={`px-3 py-1 text-xs rounded ${
                      chartType === "bar"
                        ? "bg-green-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Bar
                  </button>
                  <button
                    onClick={() => setChartType("line")}
                    className={`px-3 py-1 text-xs rounded ${
                      chartType === "line"
                        ? "bg-green-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Line
                  </button>
                </div>
              </div>
            </div>

            {payrollTrend.length > 0 ? (
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={350} minWidth={300}>
                  {chartType === "bar" ? (
                    <BarChart
                      data={payrollTrend}
                      margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#4b5563", fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis tick={{ fill: "#4b5563", fontSize: 12 }} />
                      <Tooltip
                        formatter={(value, name, props) => {
                          const data = props.payload;
                          return [
                            `₦${safeFormat(data.totalNetPay)}`,
                            `${data.fullName} ${data.year} | ${data.personnelCount} personnel`,
                          ];
                        }}
                        contentStyle={{
                          backgroundColor: "#f9fafb",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
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
                  ) : (
                    <LineChart
                      data={payrollTrend}
                      margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#4b5563", fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis tick={{ fill: "#4b5563", fontSize: 12 }} />
                      <Tooltip
                        formatter={(value, name, props) => {
                          const data = props.payload;
                          return [
                            `₦${safeFormat(data.totalNetPay)}`,
                            `${data.fullName} ${data.year} | ${data.personnelCount} personnel`,
                          ];
                        }}
                        contentStyle={{
                          backgroundColor: "#f9fafb",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Line
                        type="monotone"
                        dataKey="totalNetPay"
                        name="Total Net Payroll"
                        stroke="#16a34a"
                        strokeWidth={3}
                        dot={{ fill: "#16a34a", r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-sm md:text-base">
                    No payroll data for {selectedYear}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Select a different year or add payroll data
                  </p>
                </div>
              </div>
            )}

            {/* Summary Stats for Selected Year */}
            <div className="mt-6 pt-4 border-t grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-gray-500">Months with Data</p>
                <p className="text-lg font-bold text-green-600">
                  {payrollTrend.filter((m) => m.totalNetPay > 0).length}/12
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">
                  Total Paid ({selectedYear})
                </p>
                <p className="text-lg font-bold text-blue-600">
                  ₦
                  {safeFormat(
                    payrollTrend.reduce((sum, m) => sum + m.totalNetPay, 0)
                  )}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs text-gray-500">Avg per Month</p>
                <p className="text-lg font-bold text-purple-600">
                  ₦
                  {safeFormat(
                    Math.round(
                      payrollTrend.reduce((sum, m) => sum + m.totalNetPay, 0) /
                        12
                    )
                  )}
                </p>
              </div>
            </div>
          </motion.div>

          {/* === Recent Activities === */}
          <motion.div
            className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow"
            variants={fadeUp}
          >
            <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-4">
              Recent Activities
            </h3>
            {recentActivities.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentActivities.map((a, i) => (
                  <motion.li
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-2"
                    variants={fadeUp}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl sm:text-2xl">{a.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm md:text-base text-gray-800 break-words">
                          {a.message}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {a.time}
                        </p>
                      </div>
                    </div>
                    {a.amount && (
                      <span className="text-green-600 font-semibold text-sm md:text-base ml-10 sm:ml-0">
                        ₦{safeFormat(a.amount)}
                      </span>
                    )}
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm md:text-base">No recent activities</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
