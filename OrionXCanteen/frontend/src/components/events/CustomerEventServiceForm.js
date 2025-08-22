import React, { useState, useEffect } from 'react';
import { 
  createCustomerEventService,
  updateCustomerEventService,
  getCustomerEventServiceById,
  getAllCustomers,
  getAllEventServicesCustomer,
  getAllBookings
} from '../../services/EventService';

const CustomerEventServiceForm = ({ 
  service = null,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    event_service_id: '',
    booking_id: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('create');
  const [customers, setCustomers] = useState([]);
  const [eventServices, setEventServices] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all necessary data
        const [customersData, servicesData, bookingsData] = await Promise.all([
          getAllCustomers(),
          getAllEventServicesCustomer(),
          getAllBookings()
        ]);
        
        setCustomers(customersData);
        
        // Map service data to ensure correct field names
        const formattedServices = servicesData.map(service => ({
          Event_Service_ID: service.Event_Service_ID || service.id,
          Event_Service_Name: service.Event_Service_Name || service.name
        }));
        setEventServices(formattedServices);
        
        setBookings(bookingsData);
        
        // Initialize form data if in edit mode
        if (service) {
          setFormData({
            customer_id: service.customer_id || '',
            event_service_id: service.event_service_id || '',
            booking_id: service.booking_id || ''
          });
          setMode('edit');
        }
        
        setError('');
      } catch (err) {
        setError('Failed to load form data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [service]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'edit' && service) {
        await updateCustomerEventService(service.my_row_id, formData);
      } else {
        await createCustomerEventService(formData);
      }
      onSuccess();
    } catch (err) {
      setError('Operation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 text-center">
          <div className="flex justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-700">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {mode === 'edit' ? 'Edit Service Assignment' : 'Create New Assignment'}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700 mb-2">
                Customer *
              </label>
              <select
                id="customer_id"
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a customers</option>
                {customers.map(customers => (
                  <option key={customers.customer_id} value={customers.customer_id}>
                    {customers.name} ({customers.customer_id})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="event_service_id" className="block text-sm font-medium text-gray-700 mb-2">
                Service *
              </label>
              <select
                id="event_service_id"
                name="event_service_id"
                value={formData.event_service_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a service</option>
                {eventServices.map(service => (
                  <option key={service.Event_Service_ID} value={service.Event_Service_ID}>
                    {service.Event_Service_Name} ({service.Event_Service_ID})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="booking_id" className="block text-sm font-medium text-gray-700 mb-2">
                Booking *
              </label>
              <select
                id="booking_id"
                name="booking_id"
                value={formData.booking_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a booking</option>
                {bookings.map(booking => (
                  <option key={booking.booking_id} value={booking.booking_id}>
                    {booking.booking_id} - {formatDate(booking.booking_date)} - {booking.customer_id}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {mode === 'edit' ? 'Updating...' : 'Creating...'}
                  </span>
                ) : mode === 'edit' ? 'Update Assignment' : 'Create Assignment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerEventServiceForm;