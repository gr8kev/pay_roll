// ReportsAnalytics.jsx
import React, { useState, useMemo } from "react";
import { useGlobalData } from "../components/context/GlobalDataContext";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function ReportsAnalytics() {
  const {
    staffData,
    payrollData,
    loading,
    calculateEarnings,
    calculateDeductions,
  } = useGlobalData();

  const [dateRange, setDateRange] = useState("all");

  const COLORS = [
    "#16a34a",
    "#22c55e",
    "#4ade80",
    "#86efac",
    "#bbf7d0",
    "#dcfce7",
    "#15803d",
    "#166534",
  ];

  // Filter payrolls by date range
  const filterByDateRange = (payrolls, range) => {
    if (range === "all") return payrolls;

    const now = new Date();
    return payrolls.filter((p) => {
      const payrollDate = new Date(p.createdAt);
      if (isNaN(payrollDate)) return false;

      switch (range) {
        case "3months":
          return (now - payrollDate) / (1000 * 60 * 60 * 24 * 30) <= 3;
        case "6months":
          return (now - payrollDate) / (1000 * 60 * 60 * 24 * 30) <= 6;
        case "year":
          return (now - payrollDate) / (1000 * 60 * 60 * 24 * 365) <= 1;
        default:
          return true;
      }
    });
  };

  const {
    analytics,
    monthlyDisbursed,
    corpsDistribution,
    earningsVsDeductions,
    statusDistribution,
    salaryComponents,
    deductionComponents,
  } = useMemo(() => {
    const staff = Array.isArray(staffData) ? staffData : [];
    const payrolls = Array.isArray(payrollData) ? payrollData : [];

    const filteredPayrolls = filterByDateRange(payrolls, dateRange);

    // Calculate total payroll from filtered data
    const totalPayroll = filteredPayrolls.reduce(
      (sum, p) => sum + (p.totalAmount || 0),
      0
    );

    const averagePayroll = filteredPayrolls.length
      ? Math.round(totalPayroll / filteredPayrolls.length)
      : 0;

    const activeStaff = staff.filter((s) => s.status === "active").length;

    // Calculate average allowance from earnings
    const totalEarnings = staff
      .filter((s) => s.status === "active")
      .reduce((sum, s) => sum + calculateEarnings(s), 0);

    const avgAllowance =
      activeStaff > 0 ? Math.round(totalEarnings / activeStaff) : 0;

    const analyticsData = {
      totalPayroll,
      averagePayroll,
      activeStaff,
      totalStaff: staff.length,
      averageAllowance: avgAllowance,
    };

    // Monthly Payroll Disbursed chart (or fallback to salary components)
    const monthMap = {};
    filteredPayrolls.forEach((p) => {
      const date = new Date(p.createdAt);
      if (isNaN(date)) return;
      const monthYear = `${date.toLocaleString("default", {
        month: "short",
      })} ${date.getFullYear()}`;
      const sortKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthMap[sortKey]) {
        monthMap[sortKey] = { month: monthYear, amount: 0, sortKey };
      }
      monthMap[sortKey].amount += p.totalAmount || 0;
    });

    const monthlyDisbursedData = Object.values(monthMap)
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map(({ month, amount }) => ({ month, amount }));

    // Fallback: Total Salary Components Breakdown (if no payroll data)
    const activeStaffList = staff.filter((s) => s.status === "active");
    const salaryComponentsData = [
      {
        name: "CONAFSS",
        amount: activeStaffList.reduce(
          (sum, s) => sum + (Number(s.salary?.conafss) || 0),
          0
        ),
      },
      {
        name: "Staff Grant",
        amount: activeStaffList.reduce(
          (sum, s) => sum + (Number(s.salary?.staffGrant) || 0),
          0
        ),
      },
      {
        name: "Special Forces",
        amount: activeStaffList.reduce(
          (sum, s) => sum + (Number(s.salary?.specialForcesAllowance) || 0),
          0
        ),
      },
      {
        name: "Packing Allow.",
        amount: activeStaffList.reduce(
          (sum, s) => sum + (Number(s.salary?.packingAllowance) || 0),
          0
        ),
      },
    ].filter((item) => item.amount > 0);

    // Deduction Components Breakdown
    const deductionComponentsData = [
      {
        name: "Electricity",
        amount: activeStaffList.reduce(
          (sum, s) => sum + (Number(s.deductions?.electricityBill) || 0),
          0
        ),
      },
      {
        name: "Water Rate",
        amount: activeStaffList.reduce(
          (sum, s) => sum + (Number(s.deductions?.waterRate) || 0),
          0
        ),
      },
      {
        name: "NEWIS",
        amount: activeStaffList.reduce(
          (sum, s) => sum + (Number(s.deductions?.newisDeduction) || 0),
          0
        ),
      },
      {
        name: "Benevolent",
        amount: activeStaffList.reduce(
          (sum, s) => sum + (Number(s.deductions?.benevolent) || 0),
          0
        ),
      },
      {
        name: "Quarter Rental",
        amount: activeStaffList.reduce(
          (sum, s) => sum + (Number(s.deductions?.quarterRental) || 0),
          0
        ),
      },
      {
        name: "Income Tax",
        amount: activeStaffList.reduce(
          (sum, s) => sum + (Number(s.deductions?.incomeTax) || 0),
          0
        ),
      },
    ].filter((item) => item.amount > 0);

    // Corps Distribution (Pie Chart)
    const corpsMap = {};
    staff
      .filter((s) => s.status === "active")
      .forEach((s) => {
        const corps = s.corps || "Unassigned";
        if (!corpsMap[corps]) {
          corpsMap[corps] = { count: 0, earnings: 0 };
        }
        corpsMap[corps].count += 1;
        corpsMap[corps].earnings += calculateEarnings(s);
      });

    const corpsDistributionData = Object.entries(corpsMap)
      .map(([name, data]) => ({
        name,
        value: data.earnings,
        count: data.count,
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);

    // Earnings vs Deductions Over Time
    const earningsDeductionsMap = {};
    filteredPayrolls.forEach((p) => {
      const date = new Date(p.createdAt);
      if (isNaN(date)) return;
      const monthYear = `${date.toLocaleString("default", {
        month: "short",
      })} ${date.getFullYear()}`;
      const sortKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!earningsDeductionsMap[sortKey]) {
        earningsDeductionsMap[sortKey] = {
          month: monthYear,
          earnings: 0,
          deductions: 0,
          sortKey,
        };
      }

      p.personnel.forEach((person) => {
        earningsDeductionsMap[sortKey].earnings += calculateEarnings(person);
        earningsDeductionsMap[sortKey].deductions +=
          calculateDeductions(person);
      });
    });

    const earningsVsDeductionsData = Object.values(earningsDeductionsMap)
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map(({ month, earnings, deductions }) => ({
        month,
        earnings,
        deductions,
      }));

    // Status Distribution
    const statusMap = {};
    staff.forEach((s) => {
      const status = s.status || "unknown";
      if (!statusMap[status]) statusMap[status] = 0;
      statusMap[status] += 1;
    });

    const statusDistributionData = Object.entries(statusMap).map(
      ([name, value]) => ({ name, value })
    );

    return {
      analytics: analyticsData,
      monthlyDisbursed: monthlyDisbursedData,
      corpsDistribution: corpsDistributionData,
      earningsVsDeductions: earningsVsDeductionsData,
      statusDistribution: statusDistributionData,
      salaryComponents: salaryComponentsData,
      deductionComponents: deductionComponentsData,
    };
  }, [
    staffData,
    payrollData,
    dateRange,
    calculateEarnings,
    calculateDeductions,
  ]);

  // Export functions
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Payroll Analytics Report", 14, 20);

    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Period: ${dateRange === "all" ? "All Time" : dateRange}`, 14, 37);

    // Summary table
    autoTable(doc, {
      startY: 45,
      head: [["Metric", "Value"]],
      body: [
        [
          "Total Payroll Disbursed",
          `₦${analytics.totalPayroll.toLocaleString()}`,
        ],
        [
          "Average Monthly Payroll",
          `₦${analytics.averagePayroll.toLocaleString()}`,
        ],
        ["Total Personnel", analytics.totalStaff.toString()],
        ["Active Personnel", analytics.activeStaff.toString()],
        ["Average Earnings", `₦${analytics.averageAllowance.toLocaleString()}`],
      ],
    });

    // Monthly disbursement table
    if (monthlyDisbursed.length > 0) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Month", "Amount Disbursed"]],
        body: monthlyDisbursed.map((m) => [
          m.month,
          `₦${m.amount.toLocaleString()}`,
        ]),
      });
    }

    // Corps distribution table
    if (corpsDistribution.length > 0) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Corps", "Personnel Count", "Total Earnings"]],
        body: corpsDistribution.map((c) => [
          c.name,
          c.count.toString(),
          `₦${c.value.toLocaleString()}`,
        ]),
      });
    }

    doc.save(`payroll-report-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Summary sheet
    const summaryData = [
      ["Payroll Analytics Report"],
      ["Generated:", new Date().toLocaleDateString()],
      ["Period:", dateRange === "all" ? "All Time" : dateRange],
      [],
      ["Metric", "Value"],
      ["Total Payroll Disbursed", analytics.totalPayroll],
      ["Average Monthly Payroll", analytics.averagePayroll],
      ["Total Personnel", analytics.totalStaff],
      ["Active Personnel", analytics.activeStaff],
      ["Average Earnings", analytics.averageAllowance],
    ];

    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws1, "Summary");

    // Monthly disbursement sheet
    if (monthlyDisbursed.length > 0) {
      const ws2 = XLSX.utils.json_to_sheet(monthlyDisbursed);
      XLSX.utils.book_append_sheet(wb, ws2, "Monthly Disbursement");
    }

    // Corps distribution sheet
    if (corpsDistribution.length > 0) {
      const ws3 = XLSX.utils.json_to_sheet(corpsDistribution);
      XLSX.utils.book_append_sheet(wb, ws3, "Corps Distribution");
    }

    // Earnings vs Deductions sheet
    if (earningsVsDeductions.length > 0) {
      const ws4 = XLSX.utils.json_to_sheet(earningsVsDeductions);
      XLSX.utils.book_append_sheet(wb, ws4, "Earnings vs Deductions");
    }

    XLSX.writeFile(
      wb,
      `payroll-report-${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Reports & Analytics
            </h2>
            <p className="text-gray-600 text-sm">
              Comprehensive insights and data visualization
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Time</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="year">Last Year</option>
            </select>
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
            >
              Export PDF
            </button>
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
            >
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
          <p className="text-gray-600 text-sm font-medium mb-2">
            Total Payroll Disbursed
          </p>
          <p className="text-3xl font-bold text-gray-800 mb-1">
            ₦{analytics.totalPayroll.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">
            Across {payrollData.length} payroll cycles
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-medium mb-2">
            Average Monthly Payroll
          </p>
          <p className="text-3xl font-bold text-gray-800 mb-1">
            ₦{analytics.averagePayroll.toLocaleString()}
          </p>
          <p className="text-xs text-green-600 font-medium">
            Per payroll cycle
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-700">
          <p className="text-gray-600 text-sm font-medium mb-2">
            Total Personnel
          </p>
          <p className="text-3xl font-bold text-gray-800 mb-1">
            {analytics.totalStaff}
          </p>
          <p className="text-xs text-gray-500">
            {analytics.activeStaff} active personnel
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-800">
          <p className="text-gray-600 text-sm font-medium mb-2">
            Average Earnings
          </p>
          <p className="text-3xl font-bold text-gray-800 mb-1">
            ₦{analytics.averageAllowance.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Per active personnel</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Payroll Disbursed OR Salary Components */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {monthlyDisbursed.length > 0
              ? "Monthly Payroll Disbursed"
              : "Total Salary Components Breakdown"}
          </h3>
          {monthlyDisbursed.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyDisbursed}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="amount" fill="#16a34a" name="Amount Disbursed" />
              </BarChart>
            </ResponsiveContainer>
          ) : salaryComponents.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salaryComponents} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="amount" fill="#16a34a" name="Total Amount" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="text-gray-500 mt-2">
                  No payroll or salary data available.
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Add staff with salary information to see this chart.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Corps Distribution (Pie Chart) */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Earnings Distribution by Corps
          </h3>
          {corpsDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={corpsDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {corpsDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `₦${value.toLocaleString()} (${
                      props.payload.count
                    } personnel)`,
                    "Total Earnings",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded">
              <p className="text-gray-500">No corps data available.</p>
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings vs Deductions Line Chart OR Deduction Components */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {earningsVsDeductions.length > 0
              ? "Earnings vs Deductions Trend"
              : "Total Deductions Breakdown"}
          </h3>
          {earningsVsDeductions.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={earningsVsDeductions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#16a34a"
                  strokeWidth={2}
                  name="Total Earnings"
                />
                <Line
                  type="monotone"
                  dataKey="deductions"
                  stroke="#dc2626"
                  strokeWidth={2}
                  name="Total Deductions"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : deductionComponents.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deductionComponents} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="amount" fill="#dc2626" name="Total Amount" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="text-gray-500 mt-2">
                  No deduction data available.
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Add staff with deduction information to see this chart.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Personnel Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Personnel Status Distribution
          </h3>
          {statusDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) =>
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.name === "active" ? "#16a34a" : "#9ca3af"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded">
              <p className="text-gray-500">No status data available.</p>
            </div>
          )}
        </div>
      </div>

      {/* Corps Summary Table */}
      {corpsDistribution.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Corps Breakdown Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Corps
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Personnel Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Earnings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average per Person
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {corpsDistribution.map((corps, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {corps.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {corps.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₦{corps.value.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₦{Math.round(corps.value / corps.count).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
