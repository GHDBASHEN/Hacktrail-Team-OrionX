import React, { useEffect, useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
// Assuming your service and encryption utils are correctly located
import { getServiceVendors } from '../../services/EventService';
import { decryptCustId, decryptBookingId } from '../../utills/encryptionUtils';

const ServiceVendor = ({ customerID, bookingId }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVendors = async () => {
      setLoading(true);
      setError(null);
      try {
        // Decrypt IDs (assuming this part is necessary)
        const decryptedCustomerId = decryptCustId(customerID);
        const decryptedBookingId = decryptBookingId(bookingId);

        if (!decryptedCustomerId || !decryptedBookingId) {
          throw new Error("Invalid Customer or Booking ID.");
        }

        // Fetch data using the service function
        const vendorData = await getServiceVendors(decryptedCustomerId, decryptedBookingId);
        setVendors(vendorData);

      } catch (err) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    if (customerID && bookingId) {
      loadVendors();
    }
  }, [customerID, bookingId]); // Re-run effect if IDs change

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">
        Your Service Providers
      </h2>

      {vendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Map over the vendors array from the state */}
          {vendors.map((vendor) => (
            <div key={vendor.Vendor_ID} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              {/* Use Event_Service_Name as the title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {vendor.Event_Service_Name}
              </h3>

              <div className="space-y-3 text-gray-600">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3 text-gray-400" />
                  <a href={`tel:${vendor.Contact_no}`} className="hover:text-blue-500">
                    {vendor.Contact_no}
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3 text-gray-400" />
                  <a href={`mailto:${vendor.Email}`} className="hover:text-blue-500 truncate">
                    {vendor.Email}
                  </a>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-3 text-gray-400 mt-1 flex-shrink-0" />
                  <span>{vendor.Address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 text-gray-500">
          <p>No service providers have been assigned to this event yet.</p>
        </div>
      )}
    </div>
  );
};

export default ServiceVendor;