import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useGlobalData } from "../components/context/GlobalDataContext";

export default function Staff() {
  const {
    staffData,
    activePersonnel,
    inactivePersonnel,
    addStaff,
    updateStaff,
    deleteStaff,
    toggleStaffStatus,
    loading: contextLoading,
  } = useGlobalData();

  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [statusFilter, setStatusFilter] = useState("all");

  const initialFormData = {
    firstName: "",
    lastName: "",
    rank: "",
    serviceNumber: "",
    unit: "",
    corps: "",
    bankName: "",
    accountNumber: "",
    conafss: 0,
    staffGrant: 0,
    specialForcesAllowance: 0,
    packingAllowance: 0,
    electricityBill: 0,
    waterRate: 0,
    nawisDeduction: 0,
    benevolent: 0,
    quarterRental: 0,
    incomeTax: 0,
    passport: "",
    createdBy: "Admin",
    _id: undefined,
  };

  const [formData, setFormData] = useState(initialFormData);

  const numericFields = new Set([
    "conafss",
    "staffGrant",
    "specialForcesAllowance",
    "packingAllowance",
    "electricityBill",
    "waterRate",
    "nawisDeduction",
    "benevolent",
    "quarterRental",
    "incomeTax",
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (numericFields.has(name)) {
      const val = value === "" ? 0 : Number(value);
      setFormData((prev) => ({
        ...prev,
        [name]: Number.isFinite(val) ? val : 0,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData((prev) => ({ ...prev, passport: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleEdit = (person) => {
    setIsEditing(true);
    setFormData({
      firstName: person.firstName || "",
      lastName: person.lastName || "",
      rank: person.rank || "",
      serviceNumber: person.serviceNumber || "",
      unit: person.unit || "",
      corps: person.corps || "",
      bankName: person.bankName || "",
      accountNumber: person.accountNumber || "",
      conafss: Number(person.salary?.conafss ?? person.conafss ?? 0) || 0,
      staffGrant:
        Number(person.salary?.staffGrant ?? person.staffGrant ?? 0) || 0,
      specialForcesAllowance:
        Number(
          person.salary?.specialForcesAllowance ??
            person.specialForcesAllowance ??
            0
        ) || 0,
      packingAllowance:
        Number(
          person.salary?.packingAllowance ?? person.packingAllowance ?? 0
        ) || 0,
      electricityBill:
        Number(
          person.deductions?.electricityBill ?? person.electricityBill ?? 0
        ) || 0,
      waterRate:
        Number(person.deductions?.waterRate ?? person.waterRate ?? 0) || 0,
      nawisDeduction:
        Number(
          person.deductions?.nawisDeduction ?? person.nawisDeduction ?? 0
        ) || 0,
      benevolent:
        Number(person.deductions?.benevolent ?? person.benevolent ?? 0) || 0,
      quarterRental:
        Number(person.deductions?.quarterRental ?? person.quarterRental ?? 0) ||
        0,
      incomeTax:
        Number(person.deductions?.incomeTax ?? person.incomeTax ?? 0) || 0,
      passport: person.passport || "",
      createdBy: person.createdBy || "Admin",
      _id:
        typeof person._id === "string"
          ? person._id
          : person._id?.$oid || String(person._id),
    });
    setShowDetails(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const salary = {
        conafss: Number(formData.conafss) || 0,
        staffGrant: Number(formData.staffGrant) || 0,
        specialForcesAllowance: Number(formData.specialForcesAllowance) || 0,
        packingAllowance: Number(formData.packingAllowance) || 0,
      };

      const deductions = {
        electricityBill: Number(formData.electricityBill) || 0,
        waterRate: Number(formData.waterRate) || 0,
        nawisDeduction: Number(formData.nawisDeduction) || 0,
        benevolent: Number(formData.benevolent) || 0,
        quarterRental: Number(formData.quarterRental) || 0,
        incomeTax: Number(formData.incomeTax) || 0,
      };

      const payload = {
        firstName: (formData.firstName || "").trim(),
        lastName: (formData.lastName || "").trim(),
        rank: formData.rank || "",
        serviceNumber: formData.serviceNumber || "",
        unit: formData.unit || "",
        corps: formData.corps || "",
        bankName: formData.bankName || "",
        accountNumber: formData.accountNumber || "",
        passport: formData.passport || "",
        createdBy: formData.createdBy || "Admin",
        salary,
        deductions,
        conafss: salary.conafss,
        staffGrant: salary.staffGrant,
        specialForcesAllowance: salary.specialForcesAllowance,
        packingAllowance: salary.packingAllowance,
        electricityBill: deductions.electricityBill,
        waterRate: deductions.waterRate,
        nawisDeduction: deductions.nawisDeduction,
        benevolent: deductions.benevolent,
        quarterRental: deductions.quarterRental,
        incomeTax: deductions.incomeTax,
      };

      if (isEditing && formData._id) {
        const res = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/staff/${formData._id}`,
          payload
        );
        const updatedStaff = res.data.data || res.data;
        updateStaff(updatedStaff);
        toast.success("Personnel updated successfully!");
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/add-staff`,
          payload
        );
        const newStaff = res.data.data || res.data;
        addStaff(newStaff);
        toast.success("Personnel added successfully!");
      }

      setShowModal(false);
      setIsEditing(false);
      setFormData(initialFormData);
      setActiveTab("basic");
    } catch (error) {
      console.error("Save personnel error:", error);
      toast.error(error?.response?.data?.error || "Error saving personnel");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this personnel?"))
      return;
    try {
      await deleteStaff(id);
      setShowDetails(null);
      toast.success("Personnel removed.");
    } catch (err) {
      console.error("Delete staff error:", err);
      toast.error("Error deleting personnel");
    }
  };

  const handleToggleStatus = async (person) => {
    const newStatus = person.status === "active" ? "inactive" : "active";
    if (
      !window.confirm(
        `Change ${person.firstName} ${person.lastName} to ${newStatus}?`
      )
    )
      return;
    await toggleStaffStatus(person._id);
  };

  // Filter personnel based on status
  const filteredStaff =
    statusFilter === "all"
      ? staffData
      : statusFilter === "active"
      ? activePersonnel
      : inactivePersonnel;

  if (contextLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading personnel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-7xl mx-auto relative">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
          All Personnel
        </h2>
        <button
          onClick={() => {
            setIsEditing(false);
            setFormData(initialFormData);
            setActiveTab("basic");
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-all text-sm font-medium"
        >
          + Add Personnel
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 font-medium transition-colors ${
            statusFilter === "all"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          All ({staffData.length})
        </button>
        <button
          onClick={() => setStatusFilter("active")}
          className={`px-4 py-2 font-medium transition-colors ${
            statusFilter === "active"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Active ({activePersonnel.length})
        </button>
        <button
          onClick={() => setStatusFilter("inactive")}
          className={`px-4 py-2 font-medium transition-colors ${
            statusFilter === "inactive"
              ? "text-gray-600 border-b-2 border-gray-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Inactive ({inactivePersonnel.length})
        </button>
      </div>

      {/* Personnel Grid */}
      {Array.isArray(filteredStaff) && filteredStaff.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredStaff.map((staff) => {
            const staffId =
              typeof staff._id === "string"
                ? staff._id
                : staff._id?.$oid || String(staff._id);
            const isActive = staff.status === "active";

            return (
              <div
                key={staffId}
                className={`border rounded-xl p-4 flex flex-col items-center shadow-sm hover:shadow-md transition cursor-pointer relative ${
                  !isActive ? "opacity-60 border-gray-400" : ""
                }`}
              >
                {/* Status Badge */}
                <div
                  className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                    isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </div>

                <div onClick={() => setShowDetails(staff)}>
                  <img
                    src={
                      staff.passport ||
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='14' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E"
                    }
                    alt={staff.firstName}
                    className="w-24 h-24 rounded-full object-cover mb-3 border"
                  />
                  <h3 className="font-semibold text-gray-800 text-center">
                    {staff.firstName} {staff.lastName}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{staff.rank}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {staff.serviceNumber}
                  </p>
                </div>

                {/* Toggle Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStatus(staff);
                  }}
                  className={`mt-3 w-full text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {isActive ? "Mark Inactive" : "Mark Active"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No {statusFilter !== "all" ? statusFilter : ""} personnel found
        </p>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-white border rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-center">
              {isEditing ? "Edit Personnel" : "Add New Personnel"}
            </h3>

            <div className="flex gap-2 mb-4 border-b">
              <button
                onClick={() => setActiveTab("basic")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "basic"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500"
                }`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveTab("salary")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "salary"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500"
                }`}
              >
                Salary
              </button>
              <button
                onClick={() => setActiveTab("deductions")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "deductions"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500"
                }`}
              >
                Deductions
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === "basic" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="border rounded-lg px-3 py-2 w-full text-sm"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="border rounded-lg px-3 py-2 w-full text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="rank"
                      placeholder="Rank"
                      value={formData.rank}
                      onChange={handleChange}
                      required
                      className="border rounded-lg px-3 py-2 w-full text-sm"
                    />
                    <input
                      type="text"
                      name="serviceNumber"
                      placeholder="Service Number"
                      value={formData.serviceNumber}
                      onChange={handleChange}
                      required
                      disabled={isEditing}
                      className="border rounded-lg px-3 py-2 w-full text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="unit"
                      placeholder="Unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="border rounded-lg px-3 py-2 w-full text-sm"
                    />
                    <input
                      type="text"
                      name="corps"
                      placeholder="Corps"
                      value={formData.corps}
                      onChange={handleChange}
                      className="border rounded-lg px-3 py-2 w-full text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="bankName"
                      placeholder="Bank Name"
                      value={formData.bankName}
                      onChange={handleChange}
                      className="border rounded-lg px-3 py-2 w-full text-sm"
                    />
                    <input
                      type="text"
                      name="accountNumber"
                      placeholder="Account Number"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      className="border rounded-lg px-3 py-2 w-full text-sm"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-sm"
                  />
                </>
              )}

              {activeTab === "salary" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FieldNumber
                    name="conafss"
                    label="CONAFSS Salary"
                    value={formData.conafss}
                    onChange={handleChange}
                  />
                  <FieldNumber
                    name="staffGrant"
                    label="Staff Grant"
                    value={formData.staffGrant}
                    onChange={handleChange}
                  />
                  <FieldNumber
                    name="specialForcesAllowance"
                    label="Special Forces Allowance"
                    value={formData.specialForcesAllowance}
                    onChange={handleChange}
                  />
                  <FieldNumber
                    name="packingAllowance"
                    label="Packing Allowance"
                    value={formData.packingAllowance}
                    onChange={handleChange}
                  />
                </div>
              )}

              {activeTab === "deductions" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FieldNumber
                    name="electricityBill"
                    label="Electricity Bill"
                    value={formData.electricityBill}
                    onChange={handleChange}
                  />
                  <FieldNumber
                    name="waterRate"
                    label="Water Rate"
                    value={formData.waterRate}
                    onChange={handleChange}
                  />
                  <FieldNumber
                    name="nawisDeduction"
                    label="NaWIS Deduction"
                    value={formData.nawisDeduction}
                    onChange={handleChange}
                  />
                  <FieldNumber
                    name="benevolent"
                    label="Benevolent"
                    value={formData.benevolent}
                    onChange={handleChange}
                  />
                  <FieldNumber
                    name="quarterRental"
                    label="Quarter Rental"
                    value={formData.quarterRental}
                    onChange={handleChange}
                  />
                  <FieldNumber
                    name="incomeTax"
                    label="Income Tax"
                    value={formData.incomeTax}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm disabled:bg-green-400 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? "Saving..."
                    : isEditing
                    ? "Update Personnel"
                    : "Save Personnel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && (
        <DetailsModal
          showDetails={showDetails}
          onEdit={() => handleEdit(showDetails)}
          onDelete={() => handleDelete(showDetails._id)}
          onToggleStatus={() => handleToggleStatus(showDetails)}
          onClose={() => setShowDetails(null)}
        />
      )}
    </div>
  );
}

function FieldNumber({ name, label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded-lg px-3 py-2 w-full text-sm"
      />
    </div>
  );
}

// ✅ ENHANCED DETAILS MODAL WITH EARNINGS & DEDUCTIONS
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
