import React, { useEffect, useState } from "react";
import { deductionService, getActiveEmployees } from "../../services/UserService";

const DeductionsPage = () => {
  const [entries, setEntries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee_id: "",
    calculation_date: "",
    description: "",
    amount: "",
  });

  const [calculationState, setCalculationState] = useState({
    employee_id: "",
    month: "",
    calculatedTotal: null,
  });

  const [editEntryId, setEditEntryId] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [entriesRes, employeesRes] = await Promise.all([
          deductionService.getAllDeductionEntries(),
          getActiveEmployees(),
        ]);

        if (entriesRes.success) setEntries(entriesRes.data);
        setEmployees(employeesRes.employees);
      } catch (error) {
        console.error("Error loading data:", error);
        alert("Error loading initial data");
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      const operation = editEntryId ? "update" : "create";

      if (editEntryId) {
        response = await deductionService.updateDeduction(
          editEntryId,
          formData
        );
      } else {
        response = await deductionService.createDeduction(formData);
      }

      if (response.success) {
        alert(`Success: Deduction ${operation}d!`);
        const entriesRes = await deductionService.getAllDeductionEntries();
        if (entriesRes.success) setEntries(entriesRes.data);

        setFormData({
          employee_id: "",
          calculation_date: "",
          description: "",
          amount: "",
        });
        setEditEntryId(null);
      } else {
        alert(response.message || `Failed to ${operation} deduction`);
      }
    } catch (error) {
      console.error("Error saving deduction:", error);
      alert(`Error: Failed to ${editEntryId ? "update" : "create"} deduction`);
    }
  };

  const handleEdit = (entry) => {
    setFormData({
      employee_id: entry.employee_id,
      calculation_date: new Date(entry.calculation_date)
        .toISOString()
        .split("T")[0],
      description: entry.description,
      amount: entry.total_deductions,
    });
    setEditEntryId(entry.deductions_id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this deduction?")) {
      try {
        const response = await deductionService.deleteDeduction(id);
        if (response.success) {
          alert("Deduction deleted successfully");
          const entriesRes = await deductionService.getAllDeductionEntries();
          if (entriesRes.success) setEntries(entriesRes.data);
        }
      } catch (error) {
        console.error("Error deleting deduction:", error);
        alert(error.message || "Error deleting deduction");
      }
    }
  };

  const handleCalculate = async () => {
    if (!calculationState.employee_id || !calculationState.month) {
      alert("Please select an employees and a month.");
      return;
    }

    try {
      const response = await deductionService.calculateAndSaveMonthlyDeduction(
        calculationState.employee_id,
        calculationState.month
      );

      if (response.success) {
        alert(response.message);
        setCalculationState({
          employee_id: "",
          month: "",
          calculatedTotal: null,
        });
      } else {
        alert(
          response.message || "Failed to calculate and save monthly deduction"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error calculating and saving monthly deduction");
    }
  };

  const handleShowHistory = async () => {
    if (!calculationState.employee_id || !calculationState.month) {
      alert("Please select an employees and a month.");
      return;
    }
    try {
      const response =
        await deductionService.getMonthlyDeductionEntriesByEmployeeAndDate(
          calculationState.employee_id,
          calculationState.month
        );

      if (response.success) {
        setHistoryData(response.data);
        setShowHistoryModal(true);
      } else {
        alert(response.message || "Failed to fetch history");
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      alert("Error fetching history");
    }
  };

  return (
    <div className="min-h-screen p-6 w-full bg-gray-100">
      <div className="mx-auto w-full flex flex-col" style={{ maxWidth: "95%" }}>
        <h1 className="text-2xl font-bold mb-6">
          {editEntryId ? "Edit Deduction" : "Add New Deduction"}
        </h1>

        {/* Deduction Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded-lg mb-6 w-full shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Employee</label>
              <select
                value={formData.employee_id}
                onChange={(e) =>
                  setFormData({ ...formData, employee_id: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.name} ({emp.employee_id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={formData.calculation_date}
                onChange={(e) =>
                  setFormData({ ...formData, calculation_date: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Amount (LKR)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              {editEntryId ? "Update Deduction" : "Save Deduction"}
            </button>
            {editEntryId && (
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    employee_id: "",
                    calculation_date: "",
                    description: "",
                    amount: "",
                  });
                  setEditEntryId(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {/* Monthly Deduction Calculation */}
        <div className="bg-white p-4 rounded-lg mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Calculate Monthly Deductions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Employee</label>
              <select
                value={calculationState.employee_id}
                onChange={(e) =>
                  setCalculationState((prev) => ({
                    ...prev,
                    employee_id: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.name} ({emp.employee_id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Month</label>
              <input
                type="month"
                value={calculationState.month}
                onChange={(e) =>
                  setCalculationState((prev) => ({
                    ...prev,
                    month: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={handleCalculate}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Calculate
              </button>
              <button
                type="button"
                onClick={handleShowHistory}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Total
              </button>
            </div>
          </div>

          {calculationState.calculatedTotal !== null && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold">
                  Total Deduction: LKR{" "}
                  {calculationState.calculatedTotal.toFixed(2)}
                </h3>
              </div>
            </div>
          )}
        </div>

        {/* Total Modal */}
        {showHistoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
              <h2 className="text-xl font-semibold mb-4">Deduction History</h2>

              <div className="mb-4">
                <p className="font-medium">
                  Employee: {calculationState.employee_id}
                </p>
                <p className="font-medium">Month: {calculationState.month}</p>
              </div>

              <div className="overflow-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Employee ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Month
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total Deduction (LKR)
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {historyData.map((entry, index) => (
                      <tr key={index}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {entry.employee_id}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {new Date(entry.month_year).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                            }
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {new Intl.NumberFormat("en-LK", {
                            style: "currency",
                            currency: "LKR",
                          }).format(entry.total_deduction)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Deductions Table */}
        <div className="bg-white rounded-lg shadow overflow-auto w-full flex-1">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Employee ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount (LKR)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry) => (
                <tr key={entry.deductions_id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {entry.employee_id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {new Date(entry.calculation_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {entry.description}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {new Intl.NumberFormat("en-LK", {
                      style: "currency",
                      currency: "LKR",
                    }).format(entry.total_deductions)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                        aria-label="Edit"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(entry.deductions_id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                        aria-label="Delete"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeductionsPage;