import React, { useEffect, useState } from "react";
import { serviceChargeService } from "../../services/UserService";

const ServiceChargeTable = () => {
  const [charges, setCharges] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [totalDistributed, setTotalDistributed] = useState(0);
  const [error, setError] = useState("");

  // Helper to safely format booking_date
  const formatBookingDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const calculationResult = await serviceChargeService.calculateCharges();
      if (!calculationResult.success) {
        throw new Error(calculationResult.message);
      }

      const result = await serviceChargeService.getAllCharges();
      if (result.success) {
        const data = result.data;
        const sortedData = data.sort((a, b) => a.employee_id.localeCompare(b.employee_id));
        setCharges(sortedData);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = charges;

    // Only filter if both month and year are selected
    if (selectedMonth && selectedYear) {
      filtered = filtered.filter((row) => {
        const date = new Date(row.booking_date);
        return (
          date.getMonth() + 1 === parseInt(selectedMonth) &&
          date.getFullYear() === parseInt(selectedYear)
        );
      });
    } else if (selectedMonth) {
      filtered = filtered.filter((row) => {
        const date = new Date(row.booking_date);
        return date.getMonth() + 1 === parseInt(selectedMonth);
      });
    } else if (selectedYear) {
      filtered = filtered.filter((row) => {
        const date = new Date(row.booking_date);
        return date.getFullYear() === parseInt(selectedYear);
      });
    }

    setFilteredData(filtered);
    setTotalDistributed(
      filtered.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
    );
  }, [selectedMonth, selectedYear, charges]);

  // Get unique years from booking dates
  const getAvailableYears = () => {
    const years = new Set();
    charges.forEach(item => {
      const date = new Date(item.booking_date);
      if (!isNaN(date.getTime())) {
        years.add(date.getFullYear());
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  const groupByEvent = (data) => {
    const grouped = data.reduce((acc, current) => {
      const existing = acc.find(item => item.event_id === current.event_id);
      if (!existing) {
        acc.push({
          event_id: current.event_id,
          customer_name: current.customer_name,
          calculation_date: current.calculation_date,
          event_budget: current.event_budget,
          entries: [current]
        });
      } else {
        existing.entries.push(current);
      }
      return acc;
    }, []);

    return grouped.sort((b, a) =>
      b.event_id.localeCompare(a.event_id)
    );
  };

  const formatCurrency = (value) => {
    return parseFloat(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading service charge data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Error: {error}
        <button
          onClick={loadData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Service Charge Distribution
          </h1>
          <div className="flex items-center gap-4">
            {/* Month Selector */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Months</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>

            {/* Year Selector */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Years</option>
              {getAvailableYears().map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total Distributed</p>
                <p className="text-2xl font-semibold text-green-600">
                  LKR {formatCurrency(totalDistributed)}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {new Set(filteredData.map((item) => item.event_id)).size}
                </p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['EVENT', 'SC ID', 'EMPLOYEE', 'ROLE', 'EVENT BUDGET', 'AMOUNT', 'DATE', 'CUSTOMER'].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groupByEvent(filteredData).map((eventGroup) => (
                  <React.Fragment key={eventGroup.event_id}>
                    {eventGroup.entries.map((row, index) => (
                      <tr key={`${row.service_charge_id}-${index}`} className="hover:bg-gray-50">
                        {/* Centered EVENT Column */}
                        {index === 0 && (
                          <td
                            rowSpan={eventGroup.entries.length}
                            className="px-4 py-3 text-sm font-semibold text-gray-900 align-middle border-r"
                          >
                            {eventGroup.event_id}
                          </td>
                        )}

                        <td className="px-4 py-3 text-sm text-blue-600 font-mono">
                          #{row.service_charge_id}
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-sm">
                                {row.employee_name?.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="font-medium">{row.employee_name}</div>
                              <div className="text-gray-500 text-xs">{row.employee_id}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {row.employee_role}
                          </span>
                        </td>

                        {index === 0 && (
                          <td
                            rowSpan={eventGroup.entries.length}
                            className="px-4 py-3 text-sm text-gray-900 align-middle border-r"
                          >
                            {eventGroup.event_budget}
                          </td>
                        )}

                        <td className="px-4 py-3 text-sm font-semibold text-green-600">
                          + LKR {formatCurrency(row.amount)}
                        </td>

                        {index === 0 && (
                          <td
                            rowSpan={eventGroup.entries.length}
                            className="px-4 py-3 text-sm text-gray-500 align-middle border-r"
                          >
                            {formatBookingDate(eventGroup.entries[0].booking_date)}
                          </td>
                        )}

                        {index === 0 && (
                          <td
                            rowSpan={eventGroup.entries.length}
                            className="px-4 py-3 text-sm text-gray-900 align-middle"
                          >
                            {eventGroup.customer_name}
                          </td>
                        )}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="mt-2 text-sm">No service charges found for selected period</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceChargeTable;