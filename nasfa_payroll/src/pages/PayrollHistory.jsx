// import React, { useState, useEffect, useRef } from "react";
// import { useGlobalData } from "../components/context/GlobalDataContext";
// import { toast } from "react-hot-toast";

// export default function PayrollHistory() {
//   const {
//     payrollData,
//     loading,
//     deletePayroll,
//     calculateEarnings,
//     calculateDeductions,
//     calculateNetPay,
//     totalNetPayroll,
//   } = useGlobalData();

//   const [filteredPayrolls, setFilteredPayrolls] = useState([]);
//   const [selectedPayroll, setSelectedPayroll] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterYear, setFilterYear] = useState("all");
//   const [filterStatus, setFilterStatus] = useState("all");

//   const printRef = useRef();

//   useEffect(() => {
//     if (!Array.isArray(payrollData)) {
//       setFilteredPayrolls([]);
//       return;
//     }

//     let filtered = [...payrollData];

//     if (searchTerm) {
//       filtered = filtered.filter(
//         (p) =>
//           p.month?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           p.year?.toString().includes(searchTerm)
//       );
//     }

//     if (filterYear !== "all") {
//       filtered = filtered.filter((p) => p.year?.toString() === filterYear);
//     }

//     if (filterStatus !== "all") {
//       filtered = filtered.filter((p) => p.status === filterStatus);
//     }

//     setFilteredPayrolls(filtered);
//   }, [payrollData, searchTerm, filterYear, filterStatus]);

//   const years = Array.isArray(payrollData)
//     ? [...new Set(payrollData.map((p) => p.year).filter(Boolean))].sort(
//         (a, b) => b - a
//       )
//     : [];

//   const handleViewDetails = (payroll) => {
//     setSelectedPayroll(payroll);
//     setShowDetails(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this payroll?"))
//       return;

//     try {
//       await deletePayroll(id);
//       setShowDetails(false);
//       toast.success("Payroll deleted successfully!");
//       // eslint-disable-next-line no-unused-vars
//     } catch (error) {
//       toast.error("Error deleting payroll");
//     }
//   };

//   const handlePrint = () => {
//     if (!printRef.current) return;
//     const printContent = printRef.current.innerHTML;
//     const originalContent = document.body.innerHTML;
//     document.body.innerHTML = printContent;
//     window.print();
//     document.body.innerHTML = originalContent;
//     window.location.reload();
//   };

//   return (
//     <div className="bg-white rounded-lg shadow p-6 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">
//           Payroll History
//         </h2>
//         <p className="text-gray-600 text-sm">
//           View and manage all approved payroll records
//         </p>
//       </div>

//       {/* Filters */}
//       <div className="mb-6 space-y-4">
//         <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
//           <div className="sm:col-span-2">
//             <input
//               type="text"
//               placeholder="Search by month or year..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
//             />
//           </div>
//           <select
//             value={filterYear}
//             onChange={(e) => setFilterYear(e.target.value)}
//             className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
//           >
//             <option value="all">All Years</option>
//             {years.map((year) => (
//               <option key={year} value={year}>
//                 {year}
//               </option>
//             ))}
//           </select>
//           <select
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//             className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
//           >
//             <option value="all">All Status</option>
//             <option value="approved">Approved</option>
//             <option value="pending">Pending</option>
//             <option value="paid">Paid</option>
//           </select>
//         </div>

//         {/* Summary */}
//         <div className="flex flex-wrap gap-4 text-sm">
//           <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
//             <span className="text-green-600 font-medium">
//               Total Records: {filteredPayrolls.length}
//             </span>
//           </div>
//           <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
//             <span className="text-green-600 font-medium">
//               Total Amount: ₦{totalNetPayroll.toLocaleString()}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Payroll List */}
//       {loading ? (
//         <div className="text-center py-12">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading payroll history...</p>
//         </div>
//       ) : filteredPayrolls.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-gray-600 font-medium mb-2">
//             No payroll records found
//           </p>
//         </div>
//       ) : (
//         <>
//           {/* Desktop Table */}
//           <div className="hidden md:block overflow-x-auto border rounded-lg">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
//                     Period
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
//                     Personnel Count
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
//                     Total Amount
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
//                     Status
//                   </th>
//                   <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y">
//                 {filteredPayrolls.map((payroll) => (
//                   <tr key={payroll._id} className="hover:bg-gray-50">
//                     <td className="px-4 py-3 text-sm font-medium text-gray-800">
//                       {payroll.month} {payroll.year}
//                     </td>
//                     <td className="px-4 py-3 text-sm text-gray-600">
//                       {payroll.personnel?.length || 0}
//                     </td>
//                     <td className="px-4 py-3 text-sm font-semibold text-green-700">
//                       ₦
//                       {payroll.personnel
//                         ?.reduce((sum, p) => sum + calculateNetPay(p), 0)
//                         .toLocaleString() || 0}
//                     </td>
//                     <td className="px-4 py-3 text-sm">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           payroll.status === "approved"
//                             ? "bg-green-100 text-green-700"
//                             : payroll.status === "paid"
//                             ? "bg-blue-100 text-blue-700"
//                             : "bg-yellow-100 text-yellow-700"
//                         }`}
//                       >
//                         {payroll.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-sm text-center">
//                       <button
//                         onClick={() => handleViewDetails(payroll)}
//                         className="text-green-600 hover:text-green-700 mr-3"
//                         title="View Details"
//                       >
//                         👁️
//                       </button>
//                       <button
//                         onClick={() => handleDelete(payroll._id)}
//                         className="text-red-600 hover:text-red-700"
//                         title="Delete"
//                       >
//                         🗑️
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}

//       {/* Details Modal */}
//       {showDetails && selectedPayroll && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//           <div
//             ref={printRef}
//             className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto print:bg-white print:text-black print:shadow-none"
//           >
//             <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center print:sticky print:top-0">
//               <div>
//                 <h3 className="text-xl font-bold text-gray-800 print:text-black">
//                   Payroll Details
//                 </h3>
//                 <p className="text-sm text-gray-600 print:text-black">
//                   {selectedPayroll.month} {selectedPayroll.year} | Status:{" "}
//                   {selectedPayroll.status}
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowDetails(false)}
//                 className="text-gray-500 hover:text-gray-700 text-2xl print:hidden"
//               >
//                 ×
//               </button>
//             </div>

//             <div className="p-6">
//               {/* Totals */}
//               <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 print:grid-cols-4 print:gap-4">
//                 <div>
//                   <p>Total Personnel</p>
//                   <p>{selectedPayroll.personnel?.length || 0}</p>
//                 </div>
//                 <div>
//                   <p>Total Net Pay</p>
//                   <p>
//                     ₦
//                     {selectedPayroll.personnel
//                       ?.reduce((sum, p) => sum + calculateNetPay(p), 0)
//                       .toLocaleString() || 0}
//                   </p>
//                 </div>
//                 <div>
//                   <p>Total Earnings</p>
//                   <p>
//                     ₦
//                     {selectedPayroll.personnel
//                       ?.reduce((sum, p) => sum + calculateEarnings(p), 0)
//                       .toLocaleString() || 0}
//                   </p>
//                 </div>
//                 <div>
//                   <p>Total Deductions</p>
//                   <p>
//                     ₦
//                     {selectedPayroll.personnel
//                       ?.reduce((sum, p) => sum + calculateDeductions(p), 0)
//                       .toLocaleString() || 0}
//                   </p>
//                 </div>
//               </div>

//               {/* Personnel Table */}
//               <div className="overflow-x-auto border rounded-lg mb-6">
//                 <table className="w-full text-sm border print:border">
//                   <thead className="bg-gray-100 border-b print:bg-white print:border-b">
//                     <tr>
//                       <th className="px-4 py-2 text-left font-semibold">
//                         Name
//                       </th>
//                       <th className="px-4 py-2 text-left font-semibold">
//                         Earnings
//                       </th>
//                       <th className="px-4 py-2 text-left font-semibold">
//                         Deductions
//                       </th>
//                       <th className="px-4 py-2 text-left font-semibold">
//                         Net Pay
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {selectedPayroll.personnel?.map((p) => (
//                       <tr
//                         key={p._id}
//                         className="border-b hover:bg-gray-50 print:border-b print:bg-white"
//                       >
//                         <td className="px-4 py-2">
//                           {p.name || p.fullName || "Unnamed"}
//                         </td>
//                         <td className="px-4 py-2">
//                           ₦{calculateEarnings(p).toLocaleString()}
//                         </td>
//                         <td className="px-4 py-2">
//                           ₦{calculateDeductions(p).toLocaleString()}
//                         </td>
//                         <td className="px-4 py-2 font-semibold text-green-700">
//                           ₦{calculateNetPay(p).toLocaleString()}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               <div className="flex justify-end gap-3 print:hidden">
//                 <button
//                   onClick={handlePrint}
//                   className="px-6 py-2 rounded-lg border-2 border-green-600 text-green-600 hover:bg-green-50 font-medium text-sm"
//                 >
//                   🖨️ Print
//                 </button>
//                 <button
//                   onClick={() => setShowDetails(false)}
//                   className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium text-sm"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { useGlobalData } from "../components/context/GlobalDataContext";
import { toast } from "react-hot-toast";
import { Eye } from "lucide-react";

export default function PayrollHistory() {
  const {
    payrollData,
    loading,
    deletePayroll,
    calculateEarnings,
    calculateDeductions,
    calculateNetPay,
    totalNetPayroll,
  } = useGlobalData();

  const [filteredPayrolls, setFilteredPayrolls] = useState([]);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const printRef = useRef();

  useEffect(() => {
    if (!Array.isArray(payrollData)) {
      setFilteredPayrolls([]);
      return;
    }

    let filtered = [...payrollData];

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.month?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.year?.toString().includes(searchTerm)
      );
    }

    if (filterYear !== "all") {
      filtered = filtered.filter((p) => p.year?.toString() === filterYear);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((p) => p.status === filterStatus);
    }

    setFilteredPayrolls(filtered);
  }, [payrollData, searchTerm, filterYear, filterStatus]);

  const years = Array.isArray(payrollData)
    ? [...new Set(payrollData.map((p) => p.year).filter(Boolean))].sort(
        (a, b) => b - a
      )
    : [];

  const handleViewDetails = (payroll) => {
    setSelectedPayroll(payroll);
    setShowDetails(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payroll?"))
      return;

    try {
      await deletePayroll(id);
      setShowDetails(false);
      toast.success("Payroll deleted successfully!");
    } catch (error) {
      toast.error("Error deleting payroll");
    }
  };

  const handleGeneratePayslip = (person, payroll) => {
    setSelectedPayslip({
      person,
      month: payroll.month,
      year: payroll.year,
    });
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handlePrintPayslip = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Payroll History
        </h2>
        <p className="text-gray-600 text-sm">
          View and manage all approved payroll records
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="Search by month or year..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {/* Summary */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            <span className="text-green-600 font-medium">
              Total Records: {filteredPayrolls.length}
            </span>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            <span className="text-green-600 font-medium">
              Total Amount: ₦{totalNetPayroll.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Payroll List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payroll history...</p>
        </div>
      ) : filteredPayrolls.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 font-medium mb-2">
            No payroll records found
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto border rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Period
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Personnel Count
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Total Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPayrolls.map((payroll) => (
                  <tr key={payroll._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {payroll.month} {payroll.year}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {payroll.personnel?.length || 0}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-700">
                      ₦
                      {payroll.personnel
                        ?.reduce((sum, p) => sum + calculateNetPay(p), 0)
                        .toLocaleString() || 0}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payroll.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : payroll.status === "paid"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {payroll.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <button
                        onClick={() => handleViewDetails(payroll)}
                        className="text-green-600 hover:text-green-700 inline-flex items-center gap-1 mr-3"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(payroll._id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Details Modal */}
      {showDetails && selectedPayroll && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div
            ref={printRef}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto print:bg-white print:text-black print:shadow-none"
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center print:sticky print:top-0">
              <div>
                <h3 className="text-xl font-bold text-gray-800 print:text-black">
                  Payroll Details
                </h3>
                <p className="text-sm text-gray-600 print:text-black">
                  {selectedPayroll.month} {selectedPayroll.year} | Status:{" "}
                  {selectedPayroll.status}
                </p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl print:hidden"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* Totals */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 print:grid-cols-4 print:gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Personnel</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {selectedPayroll.personnel?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Net Pay</p>
                  <p className="text-lg font-semibold text-green-700">
                    ₦
                    {selectedPayroll.personnel
                      ?.reduce((sum, p) => sum + calculateNetPay(p), 0)
                      .toLocaleString() || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                  <p className="text-lg font-semibold text-blue-700">
                    ₦
                    {selectedPayroll.personnel
                      ?.reduce((sum, p) => sum + calculateEarnings(p), 0)
                      .toLocaleString() || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Deductions</p>
                  <p className="text-lg font-semibold text-red-700">
                    ₦
                    {selectedPayroll.personnel
                      ?.reduce((sum, p) => sum + calculateDeductions(p), 0)
                      .toLocaleString() || 0}
                  </p>
                </div>
              </div>

              {/* Personnel Table */}
              <div className="overflow-x-auto border rounded-lg mb-6">
                <table className="w-full text-sm border print:border">
                  <thead className="bg-gray-100 border-b print:bg-white print:border-b">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Rank
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Service No.
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Earnings
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Deductions
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Net Pay
                      </th>
                      <th className="px-4 py-2 text-center font-semibold print:hidden">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPayroll.personnel?.map((p) => (
                      <tr
                        key={p._id}
                        className="border-b hover:bg-gray-50 print:border-b print:bg-white"
                      >
                        <td className="px-4 py-2">
                          {p.firstName} {p.lastName}
                        </td>
                        <td className="px-4 py-2">{p.rank}</td>
                        <td className="px-4 py-2">{p.serviceNumber}</td>
                        <td className="px-4 py-2 text-blue-700">
                          ₦{calculateEarnings(p).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-red-700">
                          ₦{calculateDeductions(p).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 font-semibold text-green-700">
                          ₦{calculateNetPay(p).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-center print:hidden">
                          <button
                            onClick={() =>
                              handleGeneratePayslip(p, selectedPayroll)
                            }
                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          >
                            Payslip
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-3 print:hidden">
                <button
                  onClick={handlePrint}
                  className="px-6 py-2 rounded-lg border-2 border-green-600 text-green-600 hover:bg-green-50 font-medium text-sm"
                >
                  🖨️ Print
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payslip Modal */}
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
                  {selectedPayslip.month} {selectedPayslip.year}
                </p>
              </div>

              {/* Personnel Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Name</p>
                  <p className="font-semibold text-gray-800">
                    {selectedPayslip.person.firstName}{" "}
                    {selectedPayslip.person.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Rank</p>
                  <p className="font-semibold text-gray-800">
                    {selectedPayslip.person.rank}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Service Number
                  </p>
                  <p className="font-semibold text-gray-800">
                    {selectedPayslip.person.serviceNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Unit</p>
                  <p className="font-semibold text-gray-800">
                    {selectedPayslip.person.unit || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Bank</p>
                  <p className="font-semibold text-gray-800">
                    {selectedPayslip.person.bankName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Account Number
                  </p>
                  <p className="font-semibold text-gray-800">
                    {selectedPayslip.person.accountNumber || "N/A"}
                  </p>
                </div>
              </div>

              {/* Earnings Section */}
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
                          selectedPayslip.person.salary?.conafss || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">Staff Grant</td>
                      <td className="py-2 text-right font-semibold">
                        ₦
                        {Math.round(
                          selectedPayslip.person.salary?.staffGrant || 0
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
                          selectedPayslip.person.salary
                            ?.specialForcesAllowance || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">Packing Allowance</td>
                      <td className="py-2 text-right font-semibold">
                        ₦
                        {Math.round(
                          selectedPayslip.person.salary?.packingAllowance || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="bg-green-50 font-bold">
                      <td className="py-2 px-3">TOTAL EARNINGS</td>
                      <td className="py-2 px-3 text-right text-green-700">
                        ₦
                        {Math.round(
                          calculateEarnings(selectedPayslip.person)
                        ).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Deductions Section */}
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
                          selectedPayslip.person.deductions?.electricityBill ||
                            0
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">Water Rate</td>
                      <td className="py-2 text-right font-semibold">
                        ₦
                        {Math.round(
                          selectedPayslip.person.deductions?.waterRate || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">NAWIS Deduction</td>
                      <td className="py-2 text-right font-semibold">
                        ₦
                        {Math.round(
                          selectedPayslip.person.deductions?.nawisDeduction || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">Benevolent</td>
                      <td className="py-2 text-right font-semibold">
                        ₦
                        {Math.round(
                          selectedPayslip.person.deductions?.benevolent || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">Quarter Rental</td>
                      <td className="py-2 text-right font-semibold">
                        ₦
                        {Math.round(
                          selectedPayslip.person.deductions?.quarterRental || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-600">Income Tax</td>
                      <td className="py-2 text-right font-semibold">
                        ₦
                        {Math.round(
                          selectedPayslip.person.deductions?.incomeTax || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr className="bg-red-50 font-bold">
                      <td className="py-2 px-3">TOTAL DEDUCTIONS</td>
                      <td className="py-2 px-3 text-right text-red-700">
                        ₦
                        {Math.round(
                          calculateDeductions(selectedPayslip.person)
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
                      calculateNetPay(selectedPayslip.person)
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
