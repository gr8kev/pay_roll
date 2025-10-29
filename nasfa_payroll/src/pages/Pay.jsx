import React, { useState, useEffect } from "react";
import { useGlobalData } from "../components/context/GlobalDataContext";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

export default function Pay() {
  const {
    activePersonnel,
    totalNetPayroll,
    totalEarnings,
    totalDeductions,
    calculateNetPay,
    calculateEarnings,
    calculateDeductions,
    fetchAllData,
  } = useGlobalData();

  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const months = [
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
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];

  useEffect(() => {
    const now = new Date();
    setSelectedMonth(months[now.getMonth()]);
    setSelectedYear(currentYear.toString());
  }, []);

  useEffect(() => {
    setLoading(true);
    setPersonnel(activePersonnel || []);
    setLoading(false);
  }, [activePersonnel]);

  const handleApprovePayroll = async () => {
    if (!selectedMonth || !selectedYear) {
      toast.error("Please select month and year");
      return;
    }
    if (personnel.length === 0) {
      toast.error("No active personnel found for payroll");
      return;
    }
    if (
      !window.confirm(
        `Approve payroll for ${selectedMonth} ${selectedYear}?\nTotal Net Pay: ₦${Math.round(
          totalNetPayroll
        ).toLocaleString()}\nPersonnel: ${personnel.length}`
      )
    )
      return;

    setProcessing(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/payroll/approve`,
        {
          month: selectedMonth,
          year: parseInt(selectedYear),
          personnel,
          approvedBy: "Admin",
          notes: `Payroll for ${selectedMonth} ${selectedYear}`,
        }
      );

      toast.success("Payroll approved successfully! ✅");
      setShowPreview(false);
      fetchAllData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error approving payroll");
    } finally {
      setProcessing(false);
    }
  };

  const handleGeneratePayslip = (person) => {
    setSelectedPayslip(person);
  };

  const handlePrintPayslip = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-7xl mx-auto">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Payroll Processing
        </h2>
        <p className="text-gray-600 text-sm">
          Generate and approve monthly payroll for active personnel
        </p>
      </div>

      {/* Month/Year Selection */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Month</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setShowPreview(!showPreview)}
              disabled={!selectedMonth || !selectedYear}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {showPreview ? "Hide Preview" : "Preview Payroll"}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards - WHOLE NUMBERS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600 text-sm font-medium mb-1">
            Active Personnel
          </p>
          <p className="text-2xl font-bold text-green-700">
            {loading ? "..." : personnel.length}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-600 text-sm font-medium mb-1">
            Total Earnings
          </p>
          <p className="text-2xl font-bold text-blue-700">
            ₦{loading ? "..." : Math.round(totalEarnings).toLocaleString()}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm font-medium mb-1">
            Total Deductions
          </p>
          <p className="text-2xl font-bold text-red-700">
            ₦{loading ? "..." : Math.round(totalDeductions).toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600 text-sm font-medium mb-1">Net Payroll</p>
          <p className="text-2xl font-bold text-green-700">
            ₦{loading ? "..." : Math.round(totalNetPayroll).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Preview Table */}
      {showPreview && (
        <div className="mb-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading personnel...
            </div>
          ) : personnel.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-yellow-700 font-medium">
                No active personnel found
              </p>
              <p className="text-yellow-600 text-sm mt-1">
                Please add active personnel before processing payroll
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      S/N
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Service No.
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                      Earnings
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                      Deductions
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                      Net Pay
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {personnel.map((p, i) => {
                    const earnings = Math.round(calculateEarnings(p));
                    const deductions = Math.round(calculateDeductions(p));
                    const netPay = Math.round(calculateNetPay(p));
                    return (
                      <tr key={p._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                          {p.firstName} {p.lastName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {p.rank}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {p.serviceNumber}
                        </td>
                        <td className="px-4 py-3 text-sm text-blue-700 text-right">
                          ₦{earnings.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-red-700 text-right">
                          ₦{deductions.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-green-700 text-right">
                          ₦{netPay.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleGeneratePayslip(p)}
                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          >
                            Payslip
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50 border-t">
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-3 text-right font-semibold text-gray-800"
                    >
                      Total:
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-blue-700">
                      ₦{Math.round(totalEarnings).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-red-700">
                      ₦{Math.round(totalDeductions).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-green-700">
                      ₦{Math.round(totalNetPayroll).toLocaleString()}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Approve Button */}
          {personnel.length > 0 && (
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleApprovePayroll}
                disabled={processing}
                className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium text-sm disabled:bg-green-400 disabled:cursor-not-allowed"
              >
                {processing ? "Processing..." : "✓ Approve & Pay All"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Payslip Modal - SHOW ALL EARNINGS & DEDUCTIONS */}
      {selectedPayslip && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPayslip(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Payslip Content */}
            <div className="p-8" id="payslip-content">
              {/* Header */}
              <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  PAYSLIP
                </h1>
                <p className="text-sm text-gray-600">
                  {selectedMonth} {selectedYear}
                </p>
              </div>

              {/* Personnel Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Name</p>
                  <p className="font-semibold text-gray-800">
                    {selectedPayslip.firstName} {selectedPayslip.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Rank</p>
                  <p className="font-semibold text-gray-800">
                    {selectedPayslip.rank}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Service Number
                  </p>
                  <p className="font-semibold text-gray-800">
                    {selectedPayslip.serviceNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Unit</p>
                  <p className="font-semibold text-gray-800">
                    {selectedPayslip.unit || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Bank</p>
                  <p className="font-semibold text-gray-800">
                    {selectedPayslip.bankName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Account Number
                  </p>
                  <p className="font-semibold text-gray-800">
                    {selectedPayslip.accountNumber || "N/A"}
                  </p>
                </div>
              </div>

              {/* Earnings Section - SHOW ALL */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700 bg-green-50 px-3 py-2 rounded mb-2">
                  EARNINGS
                </h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">CONAFSS Salary</td>
                      <td className="py-2 text-right font-semibold">
                        ₦
                        {Math.round(
                          selectedPayslip.salary?.conafss || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">Staff Grant</td>
                      <td className="py-2 text-right font-semibold">
                        ₦
                        {Math.round(
                          selectedPayslip.salary?.staffGrant || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">
                        Special Forces Allowance
                      </td>
                      <td className="py-2 text-right font-semibold">
                        ₦
                        {Math.round(
                          selectedPayslip.salary?.specialForcesAllowance || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">Packing Allowance</td>
                      <td className="py-2 text-right font-semibold">
                        ₦
                        {Math.round(
                          selectedPayslip.salary?.packingAllowance || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="bg-green-50 font-bold">
                      <td className="py-2 px-3">TOTAL EARNINGS</td>
                      <td className="py-2 px-3 text-right text-green-700">
                        ₦
                        {Math.round(
                          calculateEarnings(selectedPayslip)
                        ).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Deductions Section - SHOW ALL */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700 bg-red-50 px-3 py-2 rounded mb-2">
                  DEDUCTIONS
                </h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">Electricity Bill</td>
                      <td className="py-2 text-right font-semibold">
                        ₦
                        {Math.round(
                          selectedPayslip.deductions?.electricityBill || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">Water Rate</td>
                      <td className="py-2 text-right font-semibold">
                        ₦
                        {Math.round(
                          selectedPayslip.deductions?.waterRate || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">NAWIS Deduction</td>
                      <td className="py-2 text-right font-semibold">
                        ₦
                        {Math.round(
                          selectedPayslip.deductions?.newisDeduction || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">Benevolent</td>
                      <td className="py-2 text-right font-semibold">
                        ₦
                        {Math.round(
                          selectedPayslip.deductions?.benevolent || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">Quarter Rental</td>
                      <td className="py-2 text-right font-semibold">
                        ₦
                        {Math.round(
                          selectedPayslip.deductions?.quarterRental || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">Income Tax</td>
                      <td className="py-2 text-right font-semibold">
                        ₦
                        {Math.round(
                          selectedPayslip.deductions?.incomeTax || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="bg-red-50 font-bold">
                      <td className="py-2 px-3">TOTAL DEDUCTIONS</td>
                      <td className="py-2 px-3 text-right text-red-700">
                        ₦
                        {Math.round(
                          calculateDeductions(selectedPayslip)
                        ).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Net Pay */}
              <div className="bg-green-600 text-white p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">NET PAY</span>
                  <span className="text-2xl font-bold">
                    ₦
                    {Math.round(
                      calculateNetPay(selectedPayslip)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t text-center text-xs text-gray-500">
                <p>
                  This is a computer-generated payslip and does not require a
                  signature
                </p>
                <p className="mt-1">
                  Generated on {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 p-4 border-t bg-gray-50">
              <button
                onClick={handlePrintPayslip}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm"
              >
                🖨️ Print Payslip
              </button>
              <button
                onClick={() => setSelectedPayslip(null)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
