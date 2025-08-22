import React, { useEffect, useState, useMemo } from 'react';
import {
  deleteCustomerSelectMenu,
  deleteMenuPriceFromBookingDetails,
  getAllStructuredMenuSelections,
} from "../../services/MenuService";
import { format, isAfter, isBefore, isSameDay, startOfToday } from 'date-fns';

const AdminMenuOrdersPage = () => {
  const [allCustomers, setAllCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: 'all', // 'upcoming', 'all', 'past'
    dateRange: { start: null, end: null },
    specificDate: null,
    bookingId: '',
    customerId: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const selectionsResponse = await getAllStructuredMenuSelections();
        setAllCustomers(Array.isArray(selectionsResponse) ? selectionsResponse : []);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters to data - FIXED to handle array properly
  const applyFilters = (data, filterSettings) => {
    if (!Array.isArray(data)) return [];
    
    const today = startOfToday();
    
    return data
      .filter(customers => {
        // Filter by customers ID
        if (filterSettings.customerId && 
            !customers.customer_id.toString().includes(filterSettings.customerId)) {
          return false;
        }
        return true;
      })
      .map(customers => {
        // Filter bookings for each customers
        const filteredBookings = customers.bookings?.filter(booking => {
          const bookingDate = new Date(booking.booking_date);
          
          // Filter by booking ID
          if (filterSettings.bookingId && 
              !booking.booking_id.toString().includes(filterSettings.bookingId)) {
            return false;
          }
          
          // Filter by status
          if (filterSettings.status === 'upcoming' && isBefore(bookingDate, today)) {
            return false;
          }
          
          if (filterSettings.status === 'past' && (isAfter(bookingDate, today) || isSameDay(bookingDate, today))) {
            return false;
          }
          
          // Filter by specific date
          if (filterSettings.specificDate && 
              !isSameDay(bookingDate, filterSettings.specificDate)) {
            return false;
          }
          
          // Filter by date range
          if (filterSettings.dateRange.start && filterSettings.dateRange.end) {
            const start = new Date(filterSettings.dateRange.start);
            const end = new Date(filterSettings.dateRange.end);
            end.setDate(end.getDate() + 1); // Include end date
            
            if (isBefore(bookingDate, start) || isAfter(bookingDate, end)) {
              return false;
            }
          }
          
          return true;
        }) || [];
        
        return {
          ...customers,
          bookings: filteredBookings
        };
      })
      .filter(customers => customers.bookings?.length > 0); // Only show customers with bookings
  };

  const handleDeleteMenu = async (booking) => {
    try {
      // Show confirmation dialog
      const confirmDelete = window.confirm(
        `Are you sure you want to delete the menu for booking #${booking.booking_id}? 
        This will remove all menu selections and reset the menu price.`
      );
      
      if (!confirmDelete) return;

      // Perform deletion
      const response = await deleteCustomerSelectMenu(booking.booking_id);
      await deleteMenuPriceFromBookingDetails(booking.booking_id);
      
      // Refresh data
      const updatedData = await getAllStructuredMenuSelections();
      setAllCustomers(Array.isArray(updatedData) ? updatedData : []);
      
      setSuccessMessage(response.message || "Menu deleted successfully!");
      
      // Auto-hide success message
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Error deleting menu selections:", err);
      alert(`Failed to delete menu selections: ${err.message || "Please try again."}`);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ 
      ...prev, 
      specificDate: value ? new Date(value) : null,
      dateRange: { start: null, end: null } // Reset range
    }));
  };

  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ 
      ...prev, 
      dateRange: { 
        ...prev.dateRange, 
        [name]: value ? new Date(value) : null 
      },
      specificDate: null // Reset specific date
    }));
  };

  const applyFilterChanges = () => {
    setShowFilterModal(false);
  };

  const resetFilters = () => {
    setFilters({
      status: 'upcoming',
      dateRange: { start: null, end: null },
      specificDate: null,
      bookingId: '',
      customerId: ''
    });
  };

  

  // Compute filtered customers
  const filteredCustomers = useMemo(() => {
    return applyFilters(allCustomers, filters);
  }, [allCustomers, filters]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-3 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {successMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {successMessage}
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Filter Orders</h2>
            
            <div className="space-y-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Bookings</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </div>
              
              {/* Booking ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Booking ID</label>
                <input
                  type="text"
                  name="bookingId"
                  value={filters.bookingId}
                  onChange={handleFilterChange}
                  placeholder="Enter booking ID"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Customer ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
                <input
                  type="text"
                  name="customerId"
                  value={filters.customerId}
                  onChange={handleFilterChange}
                  placeholder="Enter customers ID"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Specific Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specific Date</label>
                <input
                  type="date"
                  name="specificDate"
                  value={filters.specificDate ? format(filters.specificDate, 'yyyy-MM-dd') : ''}
                  onChange={handleDateChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    name="start"
                    value={filters.dateRange.start ? format(filters.dateRange.start, 'yyyy-MM-dd') : ''}
                    onChange={handleRangeChange}
                    placeholder="Start date"
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="date"
                    name="end"
                    value={filters.dateRange.end ? format(filters.dateRange.end, 'yyyy-MM-dd') : ''}
                    onChange={handleRangeChange}
                    placeholder="End date"
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Reset
              </button>
              <button
                onClick={applyFilterChanges}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Apply Filters
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Customer Menu Orders</h1>
            <p className="mt-2 text-gray-600">
              After deleting menu orders, the total menu price will be removed from booking details.
            </p>
            <p className="mt-2 text-red-700">Customer will need to reselect their menu.</p>
          </div>
          
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filter Orders</span>
          </button>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-gray-500">No menu orders match your filter criteria</p>
            <button 
              onClick={resetFilters}
              className="mt-4 text-indigo-600 hover:text-indigo-800"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCustomers.map((customers) => (
              <div key={customers.customer_id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {customers.bookings?.map((booking) => (
                    <div key={booking.booking_id} className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Booking on
                            {booking.booking_date ? format(new Date(booking.booking_date), ' MMMM do, yyyy') : 'No date'}
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {booking.status}
                            </span>
                            <span className="text-sm text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                              {booking.number_of_guests} guests
                            </span>
                            <span className="text-sm text-gray-500 border">
                              <b>Booking</b> #{booking.booking_id}  <b>Customer Name:</b> {customers.name}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteMenu(booking)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Delete Menu
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMenuOrdersPage;