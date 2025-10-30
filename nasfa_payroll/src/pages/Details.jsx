import React, { useState } from "react";

function DetailsModal({
  showDetails,
  onEdit,
  onDelete,
  onToggleStatus,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState("info");
  const isActive = showDetails.status === "active";

  // Calculate totals
  const salary = showDetails.salary || {};
  const deductions = showDetails.deductions || {};

  const earnings = {
    conafss: Number(salary.conafss || showDetails.conafss || 0),
    staffGrant: Number(salary.staffGrant || showDetails.staffGrant || 0),
    specialForcesAllowance: Number(
      salary.specialForcesAllowance || showDetails.specialForcesAllowance || 0
    ),
    packingAllowance: Number(
      salary.packingAllowance || showDetails.packingAllowance || 0
    ),
  };

  const deductionsList = {
    electricityBill: Number(
      deductions.electricityBill || showDetails.electricityBill || 0
    ),
    waterRate: Number(deductions.waterRate || showDetails.waterRate || 0),
    nawisDeduction: Number(
      deductions.nawisDeduction || showDetails.nawisDeduction || 0
    ),
    benevolent: Number(deductions.benevolent || showDetails.benevolent || 0),
    quarterRental: Number(
      deductions.quarterRental || showDetails.quarterRental || 0
    ),
    incomeTax: Number(deductions.incomeTax || showDetails.incomeTax || 0),
  };

  const totalEarnings = Object.values(earnings).reduce(
    (sum, val) => sum + val,
    0
  );
  const totalDeductions = Object.values(deductionsList).reduce(
    (sum, val) => sum + val,
    0
  );
  const netPay = totalEarnings - totalDeductions;

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header Section */}
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="flex flex-col items-center text-center p-6 pb-4">
            {/* Status Badge */}
            <div
              className={`mb-3 px-3 py-1 rounded-full text-sm font-medium ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </div>

            <img
              src={
                showDetails.passport ||
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect width='120' height='120' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='14' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E"
              }
              alt={showDetails.firstName}
              className="w-28 h-28 rounded-full object-cover mb-4 border"
            />
            <h3 className="text-xl font-semibold mb-1">
              {showDetails.firstName} {showDetails.lastName}
            </h3>
            <p className="text-gray-600 mb-2">{showDetails.rank}</p>
            <p className="text-gray-500 text-sm">{showDetails.serviceNumber}</p>
          </div>

          {/* Tabs */}
          <div className="flex border-t">
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === "info"
                  ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab("earnings")}
              className={`flex-1 px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === "earnings"
                  ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Earnings
            </button>
            <button
              onClick={() => setActiveTab("deductions")}
              className={`flex-1 px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === "deductions"
                  ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Deductions
            </button>
            <button
              onClick={() => setActiveTab("summary")}
              className={`flex-1 px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === "summary"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Summary
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Personal Info Tab */}
          {activeTab === "info" && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 mb-3">
                Personal Information
              </h4>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Service Number:</span>
                <span className="font-medium">{showDetails.serviceNumber}</span>
              </div>
              {showDetails.unit && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Unit:</span>
                  <span className="font-medium">{showDetails.unit}</span>
                </div>
              )}
              {showDetails.corps && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Corps:</span>
                  <span className="font-medium">{showDetails.corps}</span>
                </div>
              )}
              {showDetails.bankName && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Bank:</span>
                  <span className="font-medium">{showDetails.bankName}</span>
                </div>
              )}
              {showDetails.accountNumber && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Account Number:</span>
                  <span className="font-medium">
                    {showDetails.accountNumber}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === "earnings" && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 mb-3">
                Salary Components
              </h4>
              <div className="bg-green-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">CONAFSS Salary</span>
                  <span className="font-semibold text-green-700">
                    {formatCurrency(earnings.conafss)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Staff Grant</span>
                  <span className="font-semibold text-green-700">
                    {formatCurrency(earnings.staffGrant)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">
                    Special Forces Allowance
                  </span>
                  <span className="font-semibold text-green-700">
                    {formatCurrency(earnings.specialForcesAllowance)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Packing Allowance</span>
                  <span className="font-semibold text-green-700">
                    {formatCurrency(earnings.packingAllowance)}
                  </span>
                </div>
                <div className="border-t-2 border-green-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800 text-lg">
                      Total Earnings
                    </span>
                    <span className="font-bold text-green-600 text-xl">
                      {formatCurrency(totalEarnings)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Deductions Tab */}
          {activeTab === "deductions" && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 mb-3">
                Deduction Components
              </h4>
              <div className="bg-red-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Electricity Bill</span>
                  <span className="font-semibold text-red-700">
                    {formatCurrency(deductionsList.electricityBill)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Water Rate</span>
                  <span className="font-semibold text-red-700">
                    {formatCurrency(deductionsList.waterRate)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">NaWIS Deduction</span>
                  <span className="font-semibold text-red-700">
                    {formatCurrency(deductionsList.nawisDeduction)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Benevolent</span>
                  <span className="font-semibold text-red-700">
                    {formatCurrency(deductionsList.benevolent)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Quarter Rental</span>
                  <span className="font-semibold text-red-700">
                    {formatCurrency(deductionsList.quarterRental)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Income Tax</span>
                  <span className="font-semibold text-red-700">
                    {formatCurrency(deductionsList.incomeTax)}
                  </span>
                </div>
                <div className="border-t-2 border-red-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800 text-lg">
                      Total Deductions
                    </span>
                    <span className="font-bold text-red-600 text-xl">
                      {formatCurrency(totalDeductions)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summary Tab */}
          {activeTab === "summary" && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 mb-3">
                Payroll Summary
              </h4>

              {/* Earnings Summary */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total Earnings</span>
                  <span className="font-bold text-green-600 text-lg">
                    {formatCurrency(totalEarnings)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  {earnings.conafss > 0 && (
                    <div>• CONAFSS: {formatCurrency(earnings.conafss)}</div>
                  )}
                  {earnings.staffGrant > 0 && (
                    <div>
                      • Staff Grant: {formatCurrency(earnings.staffGrant)}
                    </div>
                  )}
                  {earnings.specialForcesAllowance > 0 && (
                    <div>
                      • Special Forces:{" "}
                      {formatCurrency(earnings.specialForcesAllowance)}
                    </div>
                  )}
                  {earnings.packingAllowance > 0 && (
                    <div>
                      • Packing: {formatCurrency(earnings.packingAllowance)}
                    </div>
                  )}
                </div>
              </div>

              {/* Deductions Summary */}
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    Total Deductions
                  </span>
                  <span className="font-bold text-red-600 text-lg">
                    {formatCurrency(totalDeductions)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  {deductionsList.electricityBill > 0 && (
                    <div>
                      • Electricity:{" "}
                      {formatCurrency(deductionsList.electricityBill)}
                    </div>
                  )}
                  {deductionsList.waterRate > 0 && (
                    <div>
                      • Water: {formatCurrency(deductionsList.waterRate)}
                    </div>
                  )}
                  {deductionsList.nawisDeduction > 0 && (
                    <div>
                      • NaWIS: {formatCurrency(deductionsList.nawisDeduction)}
                    </div>
                  )}
                  {deductionsList.benevolent > 0 && (
                    <div>
                      • Benevolent: {formatCurrency(deductionsList.benevolent)}
                    </div>
                  )}
                  {deductionsList.quarterRental > 0 && (
                    <div>
                      • Quarter Rental:{" "}
                      {formatCurrency(deductionsList.quarterRental)}
                    </div>
                  )}
                  {deductionsList.incomeTax > 0 && (
                    <div>
                      • Income Tax: {formatCurrency(deductionsList.incomeTax)}
                    </div>
                  )}
                </div>
              </div>

              {/* Net Pay */}
              <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-600 text-sm block mb-1">
                      Net Pay
                    </span>
                    <span className="text-xs text-gray-500">
                      Earnings - Deductions
                    </span>
                  </div>
                  <span className="font-bold text-blue-600 text-2xl">
                    {formatCurrency(netPay)}
                  </span>
                </div>
              </div>

              {/* Calculation Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Total Earnings:</span>
                  <span className="text-green-600 font-semibold">
                    +{formatCurrency(totalEarnings)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Total Deductions:</span>
                  <span className="text-red-600 font-semibold">
                    -{formatCurrency(totalDeductions)}
                  </span>
                </div>
                <div className="border-t-2 border-gray-300 pt-2 flex justify-between">
                  <span className="font-bold text-gray-800">Net Pay:</span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(netPay)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t p-6">
          <div className="flex flex-col gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus();
              }}
              className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                isActive
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {isActive ? "Mark as Inactive" : "Mark as Active"}
            </button>

            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-full px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsModal;
