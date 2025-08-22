// src/components/GetAllEvents.js
import React from 'react';

const GetAllEvents = ({ event, onClose }) => {
  if (!event) return null;

  // Helper function to format time values
  const formatTime = (time) => {
    if (!time) return 'N/A';
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">Event Details
            <div>
              <h4 className="text-sm font-medium text-gray-500">Booking Status</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'}`}>
                {event.status || 'N/A'}
              </span></div>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Event Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Event Type</h3>
              <p className="mt-1 capitalize">{event.eventType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Event Date</h3>
              <p className="mt-1">
                {event.Event_Date
                  ? new Date(event.Event_Date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                  : 'N/A'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Event ID</h3>
              <p className="mt-1">{event.Event_ID || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Booking ID</h3>
              <p className="mt-1">{event.booking_id || 'N/A'}</p>
            </div>
          </div>

          {/* Event-Specific Details */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium mb-4">
              {event.eventType === 'wedding' ? 'Wedding Details' : 'Custom Event Details'}
            </h3>

            {event.eventType === 'wedding' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Groom's Name</h4>
                  <p className="font-medium">{event.details?.groomName || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Bride's Name</h4>
                  <p className="font-medium">{event.details?.brideName || 'N/A'}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Groom Contact</h4>
                  <p>{event.details?.groomContact || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Bride Contact</h4>
                  <p>{event.details?.brideContact || 'N/A'}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Poruwa Ceremony</h4>
                  <p>
                    {formatTime(event.details?.poruwaCeremonyFrom)} - {formatTime(event.details?.poruwaCeremonyTo)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Registration Time</h4>
                  <p>{formatTime(event.details?.registrationTime) || 'N/A'}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Groom Address</h4>
                  <p>{event.details?.groomAddress || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Bride Address</h4>
                  <p>{event.details?.brideAddress || 'N/A'}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Fountain</h4>
                  <p>{event.details?.fountain || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Prosperity Table</h4>
                  <p>{event.details?.prosperityTable || 'N/A'}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Event Name</h4>
                  <p className="font-medium">{event.details?.eventName || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Contact Person</h4>
                  <p className="font-medium">{event.details?.contactPersonName || 'N/A'}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Contact Number</h4>
                  <p>{event.details?.contactPersonNumber || 'N/A'}</p>
                </div>
                {/* <div>
                  <h4 className="text-sm font-medium text-gray-500">Event ID</h4>
                  <p>{event.Event_ID || 'N/A'}</p>
                </div> */}
              </div>
            )}
          </div>

          {/* Common Event Details */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium mb-4">Event Timing Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Buffet Time</h4>
                <p>
                  {formatTime(event.Buffet_TimeFrom)} - {formatTime(event.Buffet_TimeTo)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Additional Time</h4>
                <p>{formatTime(event.Additional_Time) || 'N/A'}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Function Duration</h4>
                <p>
                  {formatTime(event.Function_durationFrom)} - {formatTime(event.Function_durationTo)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Tea Table Time</h4>
                <p>{formatTime(event.Tea_table_Time) || 'N/A'}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Dress Time</h4>
                <p>{formatTime(event.Dress_Time) || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Booking Details
          {event.booking_id && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium mb-4">Booking Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Booking Status</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${event.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      event.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                      'bg-blue-100 text-blue-800'}`}>
                    {event.status || 'N/A'}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Time Slot</h4>
                  <p>{event.time_slot ? `${event.time_slot.charAt(0).toUpperCase()}${event.time_slot.slice(1)}` : 'N/A'}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Number of Guests</h4>
                  <p>{event.number_of_guests || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Additional Hours</h4>
                  <p>{event.additional_hours || 0} hours</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Total Price</h4>
                  <p>{event.total_price ? `Rs. ${parseFloat(event.total_price).toFixed(2)}` : 'N/A'}</p>
                </div>
              </div>
            </div>
          )} */}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetAllEvents;