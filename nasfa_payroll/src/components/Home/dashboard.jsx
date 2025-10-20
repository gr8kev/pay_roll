import React, { useState } from "react";
import {
  Bell,
  Search,
  LogOut,
  Menu,
  BarChart3,
  Users,
  DollarSign,
  Calendar,
  FileText,
  Briefcase,
  Cog,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", icon: BarChart3 },
    { name: "Staffs", icon: Users },
    { name: "Payroll", icon: DollarSign },
    { name: "Payslip", icon: FileText },
    { name: "Payroll Calendar", icon: Calendar },
    { name: "Analytics report", icon: BarChart3 },
    { name: "Loans", icon: Briefcase },
    { name: "Reports and Documents", icon: FileText },
    { name: "Settings", icon: Cog },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return <DashboardContent />;
      case "Staffs":
        return <StaffsContent />;
      case "Payroll":
        return <PayrollContent />;
      case "Payslip":
        return <PayslipContent />;
      case "Payroll Calendar":
        return <PayrollCalendarContent />;
      case "Analytics report":
        return <AnalyticsContent />;
      case "Loans":
        return <LoansContent />;
      case "Reports and Documents":
        return <ReportsContent />;
      case "Settings":
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-50 border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
              NA
            </div>
          </div>
          {sidebarOpen && (
            <h1 className="text-sm font-bold text-gray-800">NASFA Payroll</h1>
          )}
        </div>

        {/* Menu Items */}
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
          <button className="w-full flex items-center gap-3 text-gray-700 hover:bg-gray-200 px-4 py-3 rounded transition-colors">
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <Menu size={20} />
            </button>
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search within the Dashboard"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
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
                <p className="font-medium text-sm">
                  Major. Adulkareem .S. Sultan
                </p>
                <p className="text-xs text-gray-500">Major General</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-700 rounded-full flex items-center justify-center text-white font-bold">
                MG
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">{renderContent()}</div>
      </div>
    </div>
  );
}

function DashboardContent() {
  const payrollData = [
    { month: "Jan", salary: 16, allowances: 10, arrears: 2 },
    { month: "Feb", salary: 16.5, allowances: 10.5, arrears: 1.8 },
    { month: "Mar", salary: 17, allowances: 11, arrears: 1.5 },
    { month: "Apr", salary: 16.8, allowances: 10.8, arrears: 2.1 },
    { month: "May", salary: 17.2, allowances: 11.2, arrears: 1.2 },
    { month: "Jun", salary: 18, allowances: 12, arrears: 0.9 },
    { month: "Jul", salary: 17.5, allowances: 11.5, arrears: 1.6 },
    { month: "Aug", salary: 17.8, allowances: 11.8, arrears: 1.4 },
    { month: "Sep", salary: 18.2, allowances: 12.2, arrears: 0.8 },
  ];

  const expenseData = [
    { name: "Base Salary", value: 55 },
    { name: "Allowances", value: 30 },
    { name: "Arrears", value: 15 },
  ];

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600">Welcome back Major,</p>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Staffs"
          value="12,000"
          color="green"
          percentage="90% are regular staffs"
        />
        <StatCard
          title="Payroll Processed"
          value="₦100 M"
          color="yellow"
          percentage="90% completed for this month"
        />
        <StatCard
          title="Pending payment"
          value="₦2,000,000"
          color="blue"
          percentage="90% are regular staffs"
        />
        <StatCard
          title="Loans and Tax Deduction"
          value="₦900,000"
          color="red"
          percentage="90% are regular staffs"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-2">Payroll Expense Breakdown</h2>
          <p className="text-gray-600 text-sm mb-4">
            Here is a graph of payroll expenses breakdown
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={payrollData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                label={{
                  value: "Amount (₦M)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip formatter={(value) => `₦${value}M`} />
              <Legend />
              <Bar
                dataKey="salary"
                stackId="a"
                fill="#10b981"
                name="Base Salary"
              />
              <Bar
                dataKey="allowances"
                stackId="a"
                fill="#f59e0b"
                name="Allowances"
              />
              <Bar
                dataKey="arrears"
                stackId="a"
                fill="#ef4444"
                name="Arrears"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-4">Expense Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chat Updates */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4">Chat Updates</h2>
        <div className="space-y-4">
          <ChatItem
            name="Adulkareem .S. Sultan"
            time="16:00"
            message="Helping a local business reinvent itself"
          />
          <ChatItem
            name="Rashida .S. Danjuma"
            time="16:00"
            message="Helping a local business reinvent itself"
          />
        </div>
      </div>
    </div>
  );
}

function StaffsContent() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Staffs Management</h2>
      <p className="text-gray-600">
        Staff list and management will be displayed here. This section will
        show:
      </p>
      <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
        <li>Employee directory</li>
        <li>Employee profiles and details</li>
        <li>Department assignments</li>
        <li>Contact information</li>
        <li>Employment status</li>
      </ul>
    </div>
  );
}

function PayrollContent() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Payroll Management</h2>
      <p className="text-gray-600">
        Payroll processing and management will be displayed here. This section
        will show:
      </p>
      <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
        <li>Payroll cycles</li>
        <li>Salary processing</li>
        <li>Deductions and allowances</li>
        <li>Payroll history</li>
        <li>Bulk payroll operations</li>
      </ul>
    </div>
  );
}

function PayslipContent() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Payslips</h2>
      <p className="text-gray-600">
        Employee payslips will be displayed here. This section will show:
      </p>
      <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
        <li>Payslip generation</li>
        <li>Payslip history</li>
        <li>Download and print options</li>
        <li>Salary breakdown details</li>
        <li>Tax information</li>
      </ul>
    </div>
  );
}

function PayrollCalendarContent() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Payroll Calendar</h2>
      <p className="text-gray-600">
        Payroll calendar and schedules will be displayed here. This section will
        show:
      </p>
      <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
        <li>Payroll periods</li>
        <li>Payment dates</li>
        <li>Cutoff dates</li>
        <li>Calendar events</li>
        <li>Scheduled payrolls</li>
      </ul>
    </div>
  );
}

function AnalyticsContent() {
  const analyticsData = [
    { month: "Jan", attendance: 85, performance: 78 },
    { month: "Feb", attendance: 88, performance: 82 },
    { month: "Mar", attendance: 90, performance: 85 },
    { month: "Apr", attendance: 87, performance: 80 },
    { month: "May", attendance: 92, performance: 88 },
    { month: "Jun", attendance: 94, performance: 90 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Analytics Report</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              label={{
                value: "Percentage (%)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#10b981"
              strokeWidth={2}
              name="Attendance %"
            />
            <Line
              type="monotone"
              dataKey="performance"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Performance %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LoansContent() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Loans Management</h2>
      <p className="text-gray-600">
        Loans management will be displayed here. This section will show:
      </p>
      <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
        <li>Loan applications</li>
        <li>Loan approvals</li>
        <li>Loan disbursement</li>
        <li>Loan repayments</li>
        <li>Interest calculations</li>
      </ul>
    </div>
  );
}

function ReportsContent() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Reports and Documents</h2>
      <p className="text-gray-600">
        Reports and documents will be displayed here. This section will show:
      </p>
      <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
        <li>Generated reports</li>
        <li>Document management</li>
        <li>Export options (PDF, Excel)</li>
        <li>Report templates</li>
        <li>Document archives</li>
      </ul>
    </div>
  );
}

function SettingsContent() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <p className="text-gray-600">
        System settings will be displayed here. This section will show:
      </p>
      <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
        <li>User profile settings</li>
        <li>System configuration</li>
        <li>Security settings</li>
        <li>Notification preferences</li>
        <li>Account management</li>
      </ul>
    </div>
  );
}

function StatCard({ title, value, color, percentage }) {
  const colorClasses = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className={`${colorClasses[color]} p-6 rounded-lg`}>
      <p className="text-sm font-medium mb-2">{title}</p>
      <p className="text-3xl font-bold mb-2">{value}</p>
      <p className="text-xs">{percentage}</p>
    </div>
  );
}

function ChatItem({ name, time, message }) {
  return (
    <div className="pb-3 border-b last:border-b-0">
      <p className="font-medium text-sm">{name}</p>
      <p className="text-xs text-gray-500">{time}</p>
      <p className="text-sm text-gray-700 mt-1">{message}</p>
    </div>
  );
}
