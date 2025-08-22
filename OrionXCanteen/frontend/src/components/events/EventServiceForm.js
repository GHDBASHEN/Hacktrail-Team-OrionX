import React, { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import { 
  createAdminEventService, 
  updateAdminEventService,
  getEventServiceById,
  uploadServiceImage
} from '../../services/EventService';

const EventServiceForm = ({ 
  mode = 'create', 
  serviceId = null, 
  onClose,
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    eventServiceName: '',
    imagePath: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const BASE_URL = "http://localhost:8000";

  // Load service data when in edit mode
  useEffect(() => {
    if (mode === 'edit' && serviceId) {
      const fetchService = async () => {
        setLoading(true);
        try {
          const service = await getEventServiceById(serviceId);
          setFormData({
            eventServiceName: service.Event_Service_Name,
            imagePath: service.image_path
          });
          setError('');
        } catch (err) {
          setError('Failed to load service: ' + err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchService();
    }
  }, [mode, serviceId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (file) => {
    if (!file) {
      setFormData(prev => ({ ...prev, imagePath: '' }));
      return;
    }

    setUploadingImage(true);
    try {
      // Upload image to backend
      const filePath = await uploadServiceImage(file);
      
      // Update form data with new image path
      setFormData(prev => ({ ...prev, imagePath: filePath }));
    } catch (err) {
      setError('Image upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.eventServiceName) {
        throw new Error('Service name is required');
      }
      
      if (mode === 'create' && !formData.imagePath) {
        throw new Error('Image is required');
      }

      // Create or update service
      if (mode === 'edit' && serviceId) {
        await updateAdminEventService(serviceId, formData);
      } else {
        await createAdminEventService(formData);
      }
      
      onSuccess();
    } catch (err) {
      setError('Operation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get full image URL for display
  const getImageUrl = () => {
    if (!formData.imagePath) return '';
    return `${BASE_URL}${formData.imagePath}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {mode === 'edit' ? 'Edit' : 'Create'} Event Service
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={loading || uploadingImage}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {loading && <div className="text-center py-4">Loading service data...</div>}
          
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded mb-4">
              {error}
            </div>
          )}

          {!loading && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="eventServiceName" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  id="eventServiceName"
                  name="eventServiceName"
                  value={formData.eventServiceName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter service name"
                  disabled={uploadingImage}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Image {mode === 'create' && '*'}
                </label>
                <ImageUpload 
                  onImageUpload={handleImageUpload}
                  initialImage={getImageUrl()}
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <div className="mt-2 text-sm text-blue-600">
                    Uploading image...
                  </div>
                )}
              </div>

              {formData.imagePath && !uploadingImage && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Current Image:</p>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={getImageUrl()} 
                      alt="Service preview" 
                      className="h-16 w-16 object-cover rounded border"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.parentNode.innerHTML = '<span className="text-red-500">Image failed to load</span>';
                      }}
                    />
                    <div>
                      <p className="text-sm text-gray-500">Stored on server</p>
                      <p className="text-xs text-gray-400 truncate max-w-xs">
                        {formData.imagePath}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={loading || uploadingImage}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading || uploadingImage}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {mode === 'edit' ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : mode === 'edit' ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventServiceForm;