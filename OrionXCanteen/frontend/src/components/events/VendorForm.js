import React, { useState, useEffect } from 'react';
import { 
  createAdminVendor, 
  updateAdminVendor,
  getVendorById
} from '../../services/EventService';

const VendorForm = ({ 
  mode = 'create', 
  vendorId = null,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    contact: '',
    email: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [vendorDetails, setVendorDetails] = useState(null);

  useEffect(() => {
    const fetchVendorData = async () => {
      if (mode === 'edit' && vendorId) {
        try {
          setLoading(true);
          const vendor = await getVendorById(vendorId);
          setVendorDetails(vendor);
          setFormData({
            contact: vendor.contact || '',
            email: vendor.email || '',
            address: vendor.address || ''
          });
        } catch (err) {
          setError('Failed to load vendor: ' + err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [mode, vendorId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      if (mode === 'edit') {
        if (!vendorId) {
          setError('Vendor ID is missing. Cannot update vendor.');
          setLoading(false);
          return;
        }
        response = await updateAdminVendor(vendorId, formData);
        onSuccess();
      } else {
        // For create, return the new vendor ID
        response = await createAdminVendor(formData);
        onSuccess(response.id);
      }
    } catch (err) {
      setError('Operation failed: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 text-center">
          <div className="flex justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-700">Loading vendor details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {mode === 'edit' ? 'Edit Vendor' : 'Create New Vendor'}
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
            {mode === 'edit' && vendorId && (
              <div className="mb-4 bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Vendor ID:</span> {vendorId}
                </p>
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0771234567"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="vendor@example.com"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="No. 12, Green Lane, Colombo"
              ></textarea>
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
                ) : mode === 'edit' ? 'Update Vendor' : 'Create Vendor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorForm;