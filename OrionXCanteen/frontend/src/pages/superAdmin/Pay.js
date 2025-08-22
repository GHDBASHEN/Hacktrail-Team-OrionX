import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";
import {
  calculatePay,
  getPayEntries,
  deductionService,
  notifyPayroll,
  updatePayStatus,
  notifyEmployeePayroll
} from "../../services/UserService";

const Pay = () => {
  const [selectedDate, setSelectedDate] = useState(null); // Changed to null initially
  const [payData, setPayData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [notification, setNotification] = useState(null);
  const [emailStatus, setEmailStatus] = useState({});
  const [statusUpdating, setStatusUpdating] = useState({});

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Show notification message
  const showNotification = useCallback((message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // Load payroll data
  const loadPayData = useCallback(
    async (date) => {
      try {
        setLoading(true);
        
        // If no date is provided, clear the data
        if (!date) {
          setPayData([]);
          setEmailStatus({});
          return;
        }
        
        const formattedDate = date.format("YYYY-MM-DD");
        const response = await getPayEntries(formattedDate);

        setPayData(
          response.map((item) => ({
            ...item,
            key: item.employee_id,
          }))
        );
        
        // Reset email status when data changes
        setEmailStatus({});
      } catch (error) {
        showNotification(error.message || "Failed to load pay data", true);
      } finally {
        setLoading(false);
      }
    },
    [showNotification]
  );

  // Calculate payroll handler
  const handleCalculate = async () => {
    try {
      // Check if month is selected
      if (!selectedDate) {
        showNotification("Please select a month first", true);
        return;
      }
      
      setLoading(true);
      const formattedDate = selectedDate.format("YYYY-MM-DD");

      // Calculate deductions first
      await deductionService.calculateAndSaveMonthlyDeduction(
        null,
        formattedDate
      );

      // Calculate payroll
      await calculatePay(formattedDate);

      // Refresh data and show success
      showNotification("Payroll calculated successfully!");
      await loadPayData(selectedDate);
    } catch (error) {
      showNotification(error.message || "Payroll calculation failed", true);
    } finally {
      setLoading(false);
    }
  };

  // Notification handler for salary emails
  const handleNotify = async () => {
    try {
      // Check if month is selected
      if (!selectedDate) {
        showNotification("Please select a month first", true);
        return;
      }
      
      setNotifying(true);
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      
      // Track email status for each employees
      const statusUpdates = {};
      payData.forEach(item => {
        statusUpdates[item.employee_id] = 'pending';
      });
      setEmailStatus(statusUpdates);
      
      // Send notifications
      const result = await notifyPayroll(formattedDate);
      
      if (result.success) {
        showNotification(result.message || "Salary notifications sent successfully!");
        
        // Update status based on API response
        if (result.results) {
          const newStatus = {};
          result.results.forEach(item => {
            newStatus[item.employee_id] = item.status;
          });
          setEmailStatus(newStatus);
        }
      } else {
        showNotification(result.message || "Failed to send notifications", true);
      }
    } catch (error) {
      showNotification(error.message || "An unexpected error occurred", true);
    } finally {
      setNotifying(false);
    }
  };

  // Handle individual email sending
  const handleSendIndividualEmail = async (employeeId) => {
    try {
      // Check if month is selected
      if (!selectedDate) {
        showNotification("Please select a month first", true);
        return;
      }
      
      setEmailStatus(prev => ({ ...prev, [employeeId]: 'sending' }));
      
      const employees = payData.find(item => item.employee_id === employeeId);
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      
      // Use notifyEmployeePayroll instead of notifyPayroll for individual emails
      const result = await notifyEmployeePayroll( formattedDate,employeeId,);
      console.log("oiiiiii:",employeeId, formattedDate );

      if (result.success) {
        showNotification(`Email sent to ${employees.name}`);
        setEmailStatus(prev => ({ ...prev, [employeeId]: 'sent' }));
      } else {
        showNotification(`Failed to send email to ${employees.name}: ${result.message}`, true);
        setEmailStatus(prev => ({ ...prev, [employeeId]: 'failed' }));
      }
    } catch (error) {
      showNotification(`Error sending email: ${error.message}`, true);
      setEmailStatus(prev => ({ ...prev, [employeeId]: 'failed' }));
    }
  };

  // Handle payment status change
  const handleStatusChange = async (employeeId, newStatus) => {
    try {
      // Check if month is selected
      if (!selectedDate) {
        showNotification("Please select a month first", true);
        return;
      }
      
      setStatusUpdating(prev => ({ ...prev, [employeeId]: true }));
      
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      await updatePayStatus(employeeId, formattedDate, newStatus);
      
      // Update local state
      setPayData(prev => prev.map(item => 
        item.employee_id === employeeId 
          ? { ...item, status: newStatus } 
          : item
      ));
      
      showNotification(`Status updated to ${newStatus} for employees`);
    } catch (error) {
      showNotification(`Failed to update status: ${error.message}`, true);
    } finally {
      setStatusUpdating(prev => ({ ...prev, [employeeId]: false }));
    }
  };

  // Load data when date changes
  useEffect(() => {
    loadPayData(selectedDate);
  }, [selectedDate, loadPayData]);

  // Email status indicators
  const renderEmailStatus = (employeeId) => {
    const status = emailStatus[employeeId];
    
    switch(status) {
      case 'sent':
        return (
          <span className="text-green-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Sent
          </span>
        );
      case 'failed':
        return (
          <span className="text-red-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Failed
          </span>
        );
      case 'sending':
        return (
          <span className="text-blue-600 flex items-center">
            <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending
          </span>
        );
      default:
        return (
          <button
            onClick={() => handleSendIndividualEmail(employeeId)}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Send
          </button>
        );
    }
  };

  // Payment status dropdown
  const renderPaymentStatus = (employees) => {
    if (statusUpdating[employees.employee_id]) {
      return (
        <span className="text-blue-600 flex items-center">
          <svg className="animate-spin h-4 w-4 mr-1" 
               xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" 
                    stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Updating...
        </span>
      );
    }
    
    return (
      <select
        value={employees.status || "Not Paid"}
        onChange={(e) => handleStatusChange(employees.employee_id, e.target.value)}
        className={`px-2 py-1 rounded-md border text-sm ${
          employees.status === "Paid" 
            ? "bg-green-100 text-green-800 border-green-300" 
            : "bg-red-100 text-red-800 border-red-300"
        } focus:outline-none focus:ring-1 focus:ring-blue-500`}
      >
        <option value="Paid">Paid</option>
        <option value="Not Paid">Not Paid</option>
      </select>
    );
  };

  // Fixed function to correctly calculate net salary
  const calculateCorrectNetSalary = (item) => {
    // Convert all values to numbers to ensure proper calculations
    const basicSalary = Number(item.basic_salary) || 0;
    const serviceCharge = Number(item.total_service_charge) || 0;
    const deductions = Number(item.total_deduction) || 0;
    
    // Return the correctly calculated net salary
    return basicSalary + serviceCharge - deductions;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${
            notification.isError ? "bg-red-500" : "bg-green-500"
          } z-50 animate-slide-in`}
        >
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Control Panel */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Month
              </label>
              <input
                type="month"
                value={selectedDate ? selectedDate.format("YYYY-MM") : ""}
                onChange={(e) => 
                  setSelectedDate(e.target.value ? moment(e.target.value) : null)
                }
                className="w-full sm:w-64 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCalculate}
                disabled={loading || notifying}
                className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  loading || notifying
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                    <span>Calculate Payroll</span>
                  </>
                )}
              </button>

              <button
                onClick={handleNotify}
                disabled={loading || notifying || payData.length === 0}
                className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  loading || notifying || payData.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {notifying ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>Notify All Employees</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Basic Salary
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Service Charge
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Charges
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Deductions
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Net Salary
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Payment Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Email Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {payData.map((item) => (
                  <tr key={item.employee_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {item.employee_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.basic_salary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.service_charge_percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.total_service_charge)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {formatCurrency(item.total_deduction)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      {formatCurrency(calculateCorrectNetSalary(item))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderPaymentStatus(item)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {renderEmailStatus(item.employee_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {moment(item.calculation_date).format("DD MMM YYYY")}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-900"
                  >
                    Total Net Payroll:{" "}
                    {formatCurrency(
                      payData.reduce(
                        (sum, item) => sum + calculateCorrectNetSalary(item),
                        0
                      )
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Empty State */}
          {payData.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">
                {selectedDate 
                  ? `No payroll data available for ${selectedDate.format("MMMM YYYY")}`
                  : "Please select a month to view payroll data"}
              </p>
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {(loading || notifying) && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg flex items-center gap-4">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-gray-700">
                {loading ? "Processing payroll..." : "Sending notifications..."}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pay;