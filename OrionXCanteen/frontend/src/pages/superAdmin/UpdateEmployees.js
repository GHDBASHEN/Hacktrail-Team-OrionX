import React, { useState, useEffect } from "react";
import {
  getEmployees,
  getEmployeeById,
  updateEmployee,
  getEmployeesByStatus,
  updateEmployeesStatus,
} from "../../services/UserService";

function UpdateEmployees() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    bod: "",
    salary: "",
    hire_date: "",
    service_charge_precentage: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [filterStatus, setFilterStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchEmployees();
  }, [filterStatus]);

  const fetchEmployees = async () => {
    try {
      if (filterStatus === null) {
        const response = await getEmployees();
        setEmployees(response.employees);
        return;
      }
      const response = await getEmployeesByStatus(filterStatus);
      setEmployees(response.employees); 
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = employees.filter(
    (employees) =>
      employees.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employees.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = async (employeeId) => {
    try {
      const response = await getEmployeeById(employeeId);
      setSelectedEmployee(response);
      setFormData({
        name: response.name,
        phone: response.phone,
        email: response.email,
        bod:
          response.bod && !isNaN(new Date(response.bod).getTime())
            ? new Date(response.bod).toISOString().split("T")[0]
            : "",
        salary: response.salary,
        service_charge_precentage: response.service_charge_precentage,
        hire_date:
          response.hire_date && !isNaN(new Date(response.hire_date).getTime())
            ? new Date(response.hire_date).toISOString().split("T")[0]
            : "",
      });
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      setErrorMessage("Employee name is required.");
      return;
    }

    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
      setErrorMessage("Phone number must be 10 digits.");
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage("Enter a valid email address.");
      return;
    }

    // Validate birth date is not today or in the future
    if (formData.bod) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time part
      const birthDate = new Date(formData.bod);
      
      if (birthDate >= today) {
        setErrorMessage("Birth date cannot be today or in the future.");
        return;
      }
    }

    if (!formData.salary || isNaN(formData.salary) || formData.salary <= 0) {
      setErrorMessage("Basic salary must be a positive number.");
      return;
    }

    if (
      formData.service_charge_precentage === "" ||
      isNaN(formData.service_charge_precentage) ||
      formData.service_charge_precentage < 0 ||
      formData.service_charge_precentage > 100
    ) {
      setErrorMessage("Service charge percentage must be between 0 and 100.");
      return;
    }

    try {
      await updateEmployee(selectedEmployee.employee_id, formData);
      alert("Employee updated successfully");
      setShowPopup(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employees:", error);
      setErrorMessage("An unexpected error occurred.");
    }

    setErrorMessage("");
  };

  const handleUpdateEmployeesStatus = async () => {
    try {
      if (!selectedEmployee || !selectedStatus) {
        alert("Please select an employees and a status.");
        return;
      }

      await updateEmployeesStatus(selectedEmployee.employee_id, selectedStatus);
      alert("Employee status updated successfully");

      setShowActionPopup(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employees status:", error);
      alert("An unexpected error occurred.");
    }
  };

  const handleActionClick = (employees) => {
    setSelectedEmployee(employees);
    setShowActionPopup(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-md rounded-lg border mt-5">
      <p className="text-xl font-semibold mb-4">Update Employees</p>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full h-7 p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus(null)}
          className={`px-4 py-2 rounded transition ${
            filterStatus === null
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Show All
        </button>
        
        <button
          onClick={() => setFilterStatus("active")}
          className={`px-4 py-2 rounded transition ${
            filterStatus === "active"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Active
        </button>

        <button
          onClick={() => setFilterStatus("inactive")}
          className={`px-4 py-2 rounded transition ${
            filterStatus === "inactive"
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Inactive
        </button>
        
        {filterStatus !== null && (
          <button
            onClick={() => setFilterStatus(null)}
            className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition"
          >
            Back to All
          </button>
        )}
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="border border-gray-300">
            <th className="py-1 px-2 border-r border-gray-300 text-left w-32">
              Employee ID
            </th>
            <th className="py-1 px-2 border-r border-gray-300 text-left">
              Name
            </th>
            <th className="py-1 px-2 border-r border-gray-300 text-left">
              Phone
            </th>
            <th className="py-1 px-2 border-r border-gray-300 text-left">
              Email
            </th>
            <th className="py-1 px-2 border-r border-gray-300 text-left w-32">
              Date of Birth
            </th>
            <th className="py-1 px-2 border-r border-gray-300 text-left w-32">
              Basic Salary
            </th>
            <th className="py-1 px-2 border-r border-gray-300 text-left">
              Service Charge
            </th>
            <th className="py-1 px-2 border-r border-gray-300 text-left w-32">
              Hire Date
            </th>
            <th className="py-1 px-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredEmployees.map((employees) => (
            <tr key={employees.employee_id} className="border border-gray-300">
              <td className="py-1 px-3 border-r border-gray-300">
                {employees.employee_id}
              </td>
              <td className="py-0 px-3 border-r border-gray-300">
                {employees.name}
              </td>
              <td className="py-1 px-2 border-r border-gray-300">
                {employees.phone}
              </td>
              <td className="py-1 px-2 border-r border-gray-300">
                {employees.email}
              </td>
              <td className="py-1 px-2 border-r border-gray-300">
                {employees.bod && !isNaN(new Date(employees.bod).getTime())
                  ? new Date(employees.bod).toISOString().split("T")[0]
                  : "N/A"}
              </td>
              <td className="py-1 px-2 border-r border-gray-300">
                {"LKR " + employees.salary}
              </td>
              <td className="py-1 px-2 border-r border-gray-300">
                {employees.service_charge_precentage + "%"}
              </td>
              <td className="py-1 px-2 border-r border-gray-300">
                {employees.hire_date &&
                !isNaN(new Date(employees.hire_date).getTime())
                  ? new Date(employees.hire_date).toISOString().split("T")[0]
                  : "N/A"}
              </td>
              <td className="py-1 px-2">
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(employees.employee_id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleActionClick(employees)}
                    className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition"
                  >
                    Actions
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Action Popup */}
      {showActionPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Employee Actions</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium">Change Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleUpdateEmployeesStatus}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Update Status
              </button>
              <button
                onClick={() => setShowActionPopup(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Employee</h2>
            {errorMessage && (
              <div className="text-red-500 mb-4">{errorMessage}</div>
            )}
            <div className="space-y-4 w-96">
              <div>
                <label className="block text-sm font-medium">
                  Employee name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Phone number
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Date of birthday
                </label>
                <input
                  type="date"
                  name="bod"
                  placeholder="Date of Birth"
                  value={formData.bod}
                  onChange={handleInputChange}
                  max={getTodayDate()} // Prevent future dates
                  className="w-full p-2 border border-gray-400 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Basic salary
                </label>
                <input
                  type="number"
                  name="salary"
                  placeholder="Salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Service charge (%)
                </label>
                <input
                  type="number"
                  name="service_charge_precentage"
                  placeholder="Service Charge (%)"
                  value={formData.service_charge_precentage}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Hire date</label>
                <input
                  type="date"
                  name="hire_date"
                  placeholder="Hire Date"
                  value={formData.hire_date}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  Update
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateEmployees;