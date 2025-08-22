import React, { useState, useEffect } from 'react';
import { getAllEventServicesSimple } from '../../services/EventService';

const AssignServices = ({ 
  vendor, 
  assignedServices: initialAssigned,
  onClose,
  onSave
}) => {
  const [services, setServices] = useState([]);
  const [assignedServices, setAssignedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Load services when component mounts
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getAllEventServicesSimple();
        setServices(data);
        setError('');
      } catch (err) {
        setError('Failed to load services: ' + err.message);
        console.error('Error loading services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Initialize assigned services
  useEffect(() => {
    setAssignedServices(initialAssigned || []);
  }, [initialAssigned]);

  const toggleService = (serviceId) => {
    setAssignedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId) // Deselect
        : [...prev, serviceId] // Select
    );
  };

  const handleSelectAll = () => {
    if (assignedServices.length === filteredServices.length) {
      setAssignedServices([]);
    } else {
      setAssignedServices(filteredServices.map(s => s.id));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave(assignedServices);
      onClose();
    } catch (err) {
      setError('Failed to save assignments: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter services safely
  const filteredServices = services.filter(service => {
    const serviceName = service?.name || '';
    return serviceName.toLowerCase().includes((searchTerm || '').toLowerCase());
  });

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 text-center">
          <div className="flex justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-700">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Assign Services to {vendor?.id || 'Vendor'}
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

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search services..."
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
              <button
                onClick={handleSelectAll}
                className="ml-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 whitespace-nowrap"
              >
                {assignedServices.length === filteredServices.length 
                  ? 'Deselect All' 
                  : 'Select All'}
              </button>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                <span className="text-sm font-medium text-gray-700">Vendor ID:</span>
                <span className="text-sm text-gray-900 col-span-1 sm:col-span-2">
                  {vendor?.id || 'New Vendor'}
                </span>
                
                <span className="text-sm font-medium text-gray-700">Contact:</span>
                <span className="text-sm text-gray-900 col-span-1 sm:col-span-2">
                  {vendor?.contact || 'N/A'}
                </span>
                
                <span className="text-sm font-medium text-gray-700">Email:</span>
                <span className="text-sm text-gray-900 col-span-1 sm:col-span-2">
                  {vendor?.email || 'N/A'}
                </span>
                
                <span className="text-sm font-medium text-gray-700">Selected:</span>
                <span className="text-sm font-medium text-blue-600">
                  {assignedServices.length} of {services.length} services
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto p-2">
            {filteredServices.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No services match your search</p>
              </div>
            ) : (
              filteredServices.map(service => (
                <div 
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all flex items-start ${
                    assignedServices.includes(service.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center mt-0.5 mr-3 ${
                    assignedServices.includes(service.id)
                      ? 'bg-blue-500 text-white'
                      : 'border border-gray-300'
                  }`}>
                    {assignedServices.includes(service.id) && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {service.name || 'Unnamed Service'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">ID: {service.id}</p>
                  </div>
                </div>
              ))
            )}
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
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : 'Save Assignments'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignServices;