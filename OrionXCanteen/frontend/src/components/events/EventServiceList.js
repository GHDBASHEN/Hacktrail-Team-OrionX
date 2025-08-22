import React, { useState, useEffect } from 'react';
import { getAdminEventServices, deleteAdminEventService } from '../../services/EventService';
import EventServiceForm from './EventServiceForm';

const EventServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const BASE_URL = "http://localhost:8000";

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getAdminEventServices();
      setServices(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreate = () => {
    setModalMode('create');
    setSelectedServiceId(null);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    setModalMode('edit');
    setSelectedServiceId(id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteAdminEventService(id);
        fetchServices();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleFormSuccess = () => {
    fetchServices();
    setShowModal(false);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Event Services</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Service
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {showModal && (
        <EventServiceForm
          mode={modalMode}
          serviceId={selectedServiceId}
          onClose={() => setShowModal(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  No event services found
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.Event_Service_ID}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.Event_Service_ID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {service.Event_Service_Name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {service.image_path && (
                      <img 
                        src={`${BASE_URL}${service.image_path}`} 
                        alt={service.Event_Service_Name} 
                        className="h-12 w-12 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.parentNode.innerHTML = '<span className="text-red-500 text-xs">Image error</span>';
                        }}
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(service.Event_Service_ID)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service.Event_Service_ID)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventServiceList;