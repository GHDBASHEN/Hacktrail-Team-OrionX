import React, { useState, useEffect } from 'react';
import { 
  getAdminVendors, 
  deleteAdminVendor,
  getVendorServices,
  assignServicesToVendor
} from '../../services/EventService';
import { getAllEventServicesSimple } from '../../services/EventService';
import VendorFormModal from './VendorForm';
import AssignServicesModal from './AssignServices';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [currentVendorId, setCurrentVendorId] = useState(null);
  const [newlyCreatedVendorId, setNewlyCreatedVendorId] = useState(null);
  const [services, setServices] = useState([]);
  const [assignedServices, setAssignedServices] = useState([]);
  const [modalMode, setModalMode] = useState('create');
  const [expandedVendorId, setExpandedVendorId] = useState(null);

  useEffect(() => {
    fetchVendors();
    fetchServices();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const data = await getAdminVendors();
      const normalized = data.map(vendor => ({
        ...vendor,
        services: Array.isArray(vendor.services)
          ? vendor.services.filter(s => s && s.id && s.name)
          : []
      }));
      setVendors(normalized);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const data = await getAllEventServicesSimple();
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const handleCreateVendor = () => {
    setCurrentVendorId(null);
    setModalMode('create');
    setShowVendorModal(true);
    setNewlyCreatedVendorId(null);
  };

  const handleEditVendor = (vendor) => {
    setCurrentVendorId(vendor.id);
    setModalMode('edit');
    setShowVendorModal(true);
  };

  const handleAssignServices = async (vendor) => {
    try {
      setLoading(true);
      const assigned = await getVendorServices(vendor.id);
      setCurrentVendor(vendor);
      setAssignedServices(assigned.map(s => s.id));
      setShowAssignModal(true);
    } catch (err) {
      setError('Failed to load assignments: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVendor = async (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await deleteAdminVendor(id);
        fetchVendors();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSaveAssignments = async (serviceIds) => {
    try {
      setLoading(true);
      const vendorId = newlyCreatedVendorId || currentVendor.id;
      await assignServicesToVendor(vendorId, serviceIds);
      setShowAssignModal(false);
      setNewlyCreatedVendorId(null);
      fetchVendors();
    } catch (err) {
      setError('Failed to save assignments: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleVendorDetails = (vendorId) => {
    setExpandedVendorId(expandedVendorId === vendorId ? null : vendorId);
  };

  if (loading) return <div className="text-center py-8">Loading vendors...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Event Vendors</h1>
        <button
          onClick={handleCreateVendor}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap"
        >
          Add New Vendor
        </button>
      </div>

      {/* Vendor Form Modal */}
      {showVendorModal && (
        <VendorFormModal
          mode={modalMode}
          vendorId={currentVendorId}
          onClose={() => setShowVendorModal(false)}
          onSuccess={(newVendorId) => {
            setShowVendorModal(false);
            fetchVendors();
            
            // For new vendors, open service assignment modal
            if (modalMode === 'create' && newVendorId) {
              setNewlyCreatedVendorId(newVendorId);
              setAssignedServices([]);
              setShowAssignModal(true);
            }
          }}
        />
      )}

      {/* Assign Services Modal */}
      {showAssignModal && (
        <AssignServicesModal
          vendor={
            newlyCreatedVendorId 
              ? { id: newlyCreatedVendorId } 
              : currentVendor
          }
          services={services}
          assignedServices={assignedServices}
          onClose={() => {
            setShowAssignModal(false);
            setNewlyCreatedVendorId(null);
          }}
          onSave={handleSaveAssignments}
        />
      )}

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                Vendor ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">
                Services
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vendors.map((vendor) => (
              <React.Fragment key={vendor.id}>
                <tr 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleVendorDetails(vendor.id)}
                >
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <svg 
                        className={`w-4 h-4 mr-2 transition-transform ${
                          expandedVendorId === vendor.id ? 'rotate-90' : ''
                        }`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                      {vendor.id}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {vendor.contact}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {vendor.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {vendor.services && vendor.services.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {vendor.services.slice(0, 3).map(service => (
                          <span 
                            key={`${vendor.id}-${service.id}`}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {service.name}
                          </span>
                        ))}
                        {vendor.services.length > 3 && (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            +{vendor.services.length - 3} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-red-500 text-xs">No services assigned</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditVendor(vendor);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit Vendor"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAssignServices(vendor);
                        }}
                        className="text-green-600 hover:text-green-900"
                        title="Assign Services"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteVendor(vendor.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Vendor"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                
                {expandedVendorId === vendor.id && (
                  <tr className="bg-gray-50">
                    <td colSpan="5" className="px-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Vendor ID</h3>
                          <p className="text-gray-900">{vendor.id}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                          <p className="text-gray-900">{vendor.contact}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Email</h3>
                          <p className="text-gray-900 truncate">{vendor.email}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Address</h3>
                          <p className="text-gray-900">{vendor.address}</p>
                        </div>
                        <div className="md:col-span-3">
                          <h3 className="text-sm font-medium text-gray-500">Assigned Services</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {vendor.services && vendor.services.length > 0 ? (
                              vendor.services.map(service => (
                                <span 
                                  key={service.id} 
                                  className="bg-blue-100 text-blue-800 text-xs px-3 py-1.5 rounded-full"
                                >
                                  {service.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-red-500 text-sm">No services assigned</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      {vendors.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Vendors Found</h3>
          <p className="text-gray-500">Add your first vendor to get started</p>
          <button
            onClick={handleCreateVendor}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add New Vendor
          </button>
        </div>
      )}
    </div>
  );
};

export default VendorList;