import React, { useState, useEffect } from 'react';
import { 
  getAllCustomerEventServices,
  deleteCustomerEventService
} from '../../services/EventService';
import CustomerEventServiceForm from './CustomerEventServiceForm';

const CustomerEventServiceList = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [bookingFilter, setBookingFilter] = useState('');
  const [sortField, setSortField] = useState('my_row_id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [uniqueCustomers, setUniqueCustomers] = useState([]);
  const [uniqueServices, setUniqueServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (services.length > 0) {
      // Extract unique customers and services for filter dropdowns
      const customers = [...new Set(services.map(s => s.customer_id))];
      const servicesList = [...new Set(services.map(s => s.event_service_id))];
      
      setUniqueCustomers(customers);
      setUniqueServices(servicesList);
      applyFilters();
    }
  }, [services]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, customerFilter, serviceFilter, bookingFilter, sortField, sortDirection]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getAllCustomerEventServices();
      setServices(data);
      setFilteredServices(data);
      setError('');
    } catch (err) {
      setError('Failed to load services: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...services];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(service => 
        service.customer_name.toLowerCase().includes(term) ||
        service.customer_id.toLowerCase().includes(term) ||
        service.service_name.toLowerCase().includes(term) ||
        service.event_service_id.toLowerCase().includes(term) ||
        service.booking_id.toLowerCase().includes(term) ||
        service.customer_email.toLowerCase().includes(term)
      );
    }
    
    // Apply dropdown filters
    if (customerFilter) {
      result = result.filter(service => service.customer_id === customerFilter);
    }
    
    if (serviceFilter) {
      result = result.filter(service => service.event_service_id === serviceFilter);
    }
    
    if (bookingFilter) {
      result = result.filter(service => service.booking_id === bookingFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredServices(result);
  };

  const handleCreate = () => {
    setCurrentService(null);
    setShowModal(true);
  };

  const handleEdit = (service) => {
    setCurrentService(service);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service assignment?')) {
      try {
        await deleteCustomerEventService(id);
        fetchServices();
      } catch (err) {
        setError('Delete failed: ' + err.message);
      }
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCustomerFilter('');
    setServiceFilter('');
    setBookingFilter('');
    setSortField('my_row_id');
    setSortDirection('asc');
  };

  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (loading) return <div className="text-center py-8">Loading services...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Customer Event Services</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap"
        >
          Create New Assignment
        </button>
      </div>

      {showModal && (
        <CustomerEventServiceForm
          service={currentService}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchServices();
          }}
        />
      )}

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Search by customers, service, booking..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg 
                className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          
          <div>
            <label htmlFor="customerFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Customer
            </label>
            <select
              id="customerFilter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
            >
              <option value="">All Customers</option>
              {uniqueCustomers.map(customerId => {
                const customers = services.find(s => s.customer_id === customerId);
                return (
                  <option key={customerId} value={customerId}>
                    {customers ? customers.customer_name : customerId}
                  </option>
                );
              })}
            </select>
          </div>
          
          <div>
            <label htmlFor="serviceFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Service
            </label>
            <select
              id="serviceFilter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
            >
              <option value="">All Services</option>
              {uniqueServices.map(serviceId => {
                const service = services.find(s => s.event_service_id === serviceId);
                return (
                  <option key={serviceId} value={serviceId}>
                    {service ? service.service_name : serviceId}
                  </option>
                );
              })}
            </select>
          </div>
          
          <div>
            <label htmlFor="bookingFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Booking ID
            </label>
            <select
              id="bookingFilter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={bookingFilter}
              onChange={(e) => setBookingFilter(e.target.value)}
            >
              <option value="">All Bookings</option>
              {[...new Set(services.map(s => s.booking_id))].map(bookingId => (
                <option key={bookingId} value={bookingId}>
                  {bookingId}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-between mt-4">
          <div className="text-sm text-gray-600">
            Showing {filteredServices.length} of {services.length} assignments
          </div>
          <button
            onClick={resetFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('my_row_id')}
              >
                <div className="flex items-center">
                  ID {renderSortIndicator('my_row_id')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('customer_name')}
              >
                <div className="flex items-center">
                  Customer {renderSortIndicator('customer_name')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('service_name')}
              >
                <div className="flex items-center">
                  Service {renderSortIndicator('service_name')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('booking_id')}
              >
                <div className="flex items-center">
                  Booking ID {renderSortIndicator('booking_id')}
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredServices.map((service) => (
              <tr key={service.my_row_id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-900">
                  {service.my_row_id}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  <div>
                    <div className="font-medium">{service.customer_name}</div>
                    <div className="text-xs text-gray-400">{service.customer_id}</div>
                    <div className="text-xs">{service.customer_email}</div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  <div>
                    <div className="font-medium">{service.service_name}</div>
                    <div className="text-xs text-gray-400">{service.event_service_id}</div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {service.booking_id}
                </td>
                <td className="px-4 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(service.my_row_id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredServices.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow p-8 text-center mt-6">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Matching Assignments Found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters</p>
          <button
            onClick={resetFilters}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerEventServiceList;