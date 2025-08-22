import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/Authcontext";
import { getPlannedEvents, updatetheEvent, deletetheEvent } from "../../services/EventService";
import { useParams } from "react-router-dom";
import { Calendar, Clock, User, CheckCircle, PartyPopper, Heart, X, Home, Edit, Trash2, AlertTriangle } from "lucide-react";
import { decryptBookingId } from "../../utills/encryptionUtils.js";

// Helper components
const FormField = ({ label, name, value, type = 'text', onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
);

const SelectField = ({ label, name, value, options, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select 
      name={name} 
      value={value} 
      onChange={onChange} 
      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// FIXED: Improved time formatting function
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "N/A";
  
  // Handle time-only strings (HH:MM:SS)
  if (typeof dateTimeString === 'string' && /^\d{1,2}:\d{2}(:\d{2})?$/.test(dateTimeString)) {
    const parts = dateTimeString.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  }
  
  // Handle full date-time strings
  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return "Invalid Date";
    
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return "Invalid Format";
  }
};

// Main Component
const DisplayEvents = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTypes, setEventTypes] = useState({});
  
  // State for modals
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [eventToUpdate, setEventToUpdate] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const { bookingId } = useParams();
  
  // Initial data fetch
  useEffect(() => {
    const fetchEventForBooking = async () => {
      try {
        const customerID = sessionStorage.getItem("id");
        if (!customerID) {
          setError("Your session has expired. Please log in again.");
          setLoading(false);
          return;
        }

        if (!bookingId) {
          setError("Booking ID is missing from the URL.");
          setLoading(false);
          return;
        }
        
        const decryptedBookingId = decryptBookingId(bookingId);
        if (!decryptedBookingId) {
          setError("Could not verify the event identifier.");
          setLoading(false);
          return;
        }

        const data = await getPlannedEvents(customerID, decryptedBookingId);
        setEvents(data);
        
        // Store event types for update/delete operations
        const types = {};
        data.forEach(event => {
          types[event.Event_ID] = event.Groom_Name ? "wedding" : "custom";
        });
        setEventTypes(types);
        
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError(err.message || "Could not load event details.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventForBooking();
  }, [bookingId, user]);

  // Handlers to open modals
  const handleOpenUpdateModal = (event) => {
    setEventToUpdate({ ...event });
    setUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setUpdateModalOpen(false);
    setEventToUpdate(null);
  };

  const handleEventUpdated = (updatedEvent) => {
    setEvents(prevEvents => 
      prevEvents.map(e => e.Event_ID === updatedEvent.Event_ID ? updatedEvent : e)
    );
    setSelectedEvent(updatedEvent);
  };

const handleDeleteEvent = async (eventId) => {
    try {
      await deletetheEvent(eventId);
      
      setEvents(prevEvents => 
        prevEvents.filter(e => e.Event_ID !== eventId)
      );
      
      if (selectedEvent?.Event_ID === eventId) {
        setSelectedEvent(null);
      }
      
      setShowDeleteConfirm(false);
      alert('Event deleted successfully!');
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert(`Failed to delete event: ${error.message}`);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center p-8">
      <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <p className="text-red-600 text-xl">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        My Planned Event
      </h2>

      {selectedEvent && (
        <EventModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
          onUpdate={() => handleOpenUpdateModal(selectedEvent)}
          onDelete={() => {
            setEventToDelete(selectedEvent.Event_ID);
            setShowDeleteConfirm(true);
          }}
        />
      )}

      {isUpdateModalOpen && eventToUpdate && (
        <UpdateEventModal
          event={eventToUpdate}
          eventType={eventTypes[eventToUpdate.Event_ID]}
          onClose={handleCloseUpdateModal}
          onEventUpdated={handleEventUpdated}
        />
      )}

      {showDeleteConfirm && eventToDelete && (
        <ConfirmDeleteModal
          eventId={eventToDelete}
          onConfirm={() => handleDeleteEvent(eventToDelete)}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setEventToDelete(null);
          }}
        />
      )}

      {events.length === 0 ? (
        <div className="text-center py-12">
          <PartyPopper className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600">No event details were found for this booking.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div 
              key={event.Event_ID} 
              className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Event #{event.Event_ID}</h3>
                  {event.Groom_Name ? (
                    <Heart className="w-6 h-6 text-pink-400" />
                  ) : (
                    <PartyPopper className="w-6 h-6 text-yellow-500" />
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Function Time</p>
                      <p className="font-medium text-sm">
                        {formatDateTime(event.Function_durationFrom)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Event Type</p>
                      <p className="font-medium text-sm">
                        {event.Groom_Name 
                          ? "Wedding" 
                          : event.Custom_Event_Name || "Custom Event"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <button 
                    onClick={() => setSelectedEvent(event)}
                    className="px-6 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors shadow-md"
                  >
                    View Full Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Event Details Modal
const EventModal = ({ event, onClose, onUpdate, onDelete }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 flex justify-between items-center sticky top-0">
          <h2 className="text-xl font-bold text-white">Event Details #{event.Event_ID}</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Event Timeline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Clock className="w-5 h-5" />
              <h4 className="font-semibold">Event Timeline</h4>
            </div>
            
            <div className="space-y-3 pl-7 border-l-2 border-blue-100">
              <div>
                <p className="text-sm text-gray-500">Function Duration</p>
                <p className="font-medium">
                  {formatDateTime(event.Function_durationFrom)} - {formatDateTime(event.Function_durationTo)}
                </p>
              </div>
              
              {event.Dress_Time && (
                <div>
                  <p className="text-sm text-gray-500">Dressing Time</p>
                  <p className="font-medium">{formatDateTime(event.Dress_Time)}</p>
                </div>
              )}
              
              {event.Poruwa_CeremonyFrom && (
                <div>
                  <p className="text-sm text-gray-500">Poruwa Ceremony</p>
                  <p className="font-medium">
                    {formatDateTime(event.Poruwa_CeremonyFrom)} - {formatDateTime(event.Poruwa_CeremonyTo)}
                  </p>
                </div>
              )}
              
              {event.Registration_Time && (
                <div>
                  <p className="text-sm text-gray-500">Registration Time</p>
                  <p className="font-medium">{formatDateTime(event.Registration_Time)}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-500">Buffet Time</p>
                <p className="font-medium">
                  {formatDateTime(event.Buffet_TimeFrom)} - {formatDateTime(event.Buffet_TimeTo)}
                </p>
              </div>
              
              {event.Tea_table_Time && (
                <div>
                  <p className="text-sm text-gray-500">Tea Time</p>
                  <p className="font-medium">{formatDateTime(event.Tea_table_Time)}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Wedding Details */}
          {event.Groom_Name && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-pink-600">
                <Heart className="w-5 h-5" />
                <h4 className="font-semibold">Wedding Details</h4>
              </div>
              
              <div className="pl-7 border-l-2 border-pink-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Groom</p>
                    <p className="font-medium flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {event.Groom_Name}
                    </p>
                    <p className="text-sm text-gray-600">{event.Groom_Contact_no}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Home className="w-3 h-3" />
                      {event.Groom_Address}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Bride</p>
                    <p className="font-medium flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {event.Bride_Name}
                    </p>
                    <p className="text-sm text-gray-600">{event.Bride_Contact_no}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Home className="w-3 h-3" />
                      {event.Bride_Address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Additional Features */}
          {(event.Fountain || event.ProsperityTable) && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <h4 className="font-semibold">Additional Features</h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-7 border-l-2 border-green-100">
                {event.Fountain && (
                  <div>
                    <p className="text-sm text-gray-500">Fountain</p>
                    <p className="font-medium capitalize">{event.Fountain}</p>
                  </div>
                )}
                
                {event.ProsperityTable && (
                  <div>
                    <p className="text-sm text-gray-500">Prosperity Table</p>
                    <p className="font-medium capitalize">{event.ProsperityTable}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Custom Event Details */}
          {event.Custom_Event_Name && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-purple-600">
                <Calendar className="w-5 h-5" />
                <h4 className="font-semibold">{event.Custom_Event_Name}</h4>
              </div>
              
              <div className="pl-7 border-l-2 border-purple-100">
                <p className="text-sm text-gray-500">Contact Person</p>
                <p className="font-medium">
                  {event.ContactPersonName} ({event.ContactPersonNumber})
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 sticky bottom-0 border-t flex justify-end items-center gap-3">
          <button 
            onClick={() => onUpdate()} 
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-semibold hover:bg-yellow-600 flex items-center gap-2 transition-colors"
          >
            <Edit className="w-4 h-4" /> Update
          </button>
          
          <button 
            onClick={() => onDelete()} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Update Event Modal
const UpdateEventModal = ({ event, eventType, onClose, onEventUpdated }) => {
  const [formData, setFormData] = useState(event);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // FIXED: Enhanced time normalization
      const normalizeTime = (time) => {
        if (!time) return null;
        if (typeof time === 'string') {
          // Handle HH:MM format
          if (/^\d{1,2}:\d{2}$/.test(time)) {
            return `${time}:00`;
          }
          // Handle HH:MM:SS format
          if (/^\d{1,2}:\d{2}:\d{2}$/.test(time)) {
            return time;
          }
        }
        return time;
      };

      // Create payload with normalized times
      const payload = {
        ...formData,
        Function_durationFrom: normalizeTime(formData.Function_durationFrom),
        Function_durationTo: normalizeTime(formData.Function_durationTo),
        Buffet_TimeFrom: normalizeTime(formData.Buffet_TimeFrom),
        Buffet_TimeTo: normalizeTime(formData.Buffet_TimeTo),
        Tea_table_Time: normalizeTime(formData.Tea_table_Time),
        Dress_Time: normalizeTime(formData.Dress_Time),
        Poruwa_CeremonyFrom: normalizeTime(formData.Poruwa_CeremonyFrom),
        Poruwa_CeremonyTo: normalizeTime(formData.Poruwa_CeremonyTo),
        Registration_Time: normalizeTime(formData.Registration_Time),
        eventType
      };
      
      const updatedEvent = await updatetheEvent(formData.Event_ID, payload);
      onEventUpdated(updatedEvent);
      onClose();
    } catch (err) {
      console.error("Failed to update event:", err);
      setError(err.message || "Failed to update event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[95vh] shadow-2xl flex flex-col">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Update Event #{event.Event_ID}</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* General Event Details */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                label="Function Start Time" 
                name="Function_durationFrom" 
                value={formData.Function_durationFrom} 
                type="time" 
                onChange={handleInputChange} 
              />
              
              <FormField 
                label="Function End Time" 
                name="Function_durationTo" 
                value={formData.Function_durationTo} 
                type="time" 
                onChange={handleInputChange} 
              />
              
              <FormField 
                label="Buffet Start Time" 
                name="Buffet_TimeFrom" 
                value={formData.Buffet_TimeFrom} 
                type="time" 
                onChange={handleInputChange} 
              />
              
              <FormField 
                label="Buffet End Time" 
                name="Buffet_TimeTo" 
                value={formData.Buffet_TimeTo} 
                type="time" 
                onChange={handleInputChange} 
              />
              
              <FormField 
                label="Tea Time" 
                name="Tea_table_Time" 
                value={formData.Tea_table_Time} 
                type="time" 
                onChange={handleInputChange} 
              />
            </div>
          </div>

          {/* Conditional Wedding Form */}
          {eventType === "wedding" && (
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-4 text-pink-600">Wedding Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField 
                  label="Groom's Name" 
                  name="Groom_Name" 
                  value={formData.Groom_Name} 
                  onChange={handleInputChange} 
                />
                
                <FormField 
                  label="Bride's Name" 
                  name="Bride_Name" 
                  value={formData.Bride_Name} 
                  onChange={handleInputChange} 
                />
                
                <FormField 
                  label="Groom's Contact" 
                  name="Groom_Contact_no" 
                  value={formData.Groom_Contact_no} 
                  onChange={handleInputChange} 
                />
                
                <FormField 
                  label="Bride's Contact" 
                  name="Bride_Contact_no" 
                  value={formData.Bride_Contact_no} 
                  onChange={handleInputChange} 
                />
                
                <FormField 
                  label="Groom's Address" 
                  name="Groom_Address" 
                  value={formData.Groom_Address} 
                  onChange={handleInputChange} 
                />
                
                <FormField 
                  label="Bride's Address" 
                  name="Bride_Address" 
                  value={formData.Bride_Address} 
                  onChange={handleInputChange} 
                />
                
                <FormField 
                  label="Dressing Time" 
                  name="Dress_Time" 
                  value={formData.Dress_Time} 
                  type="time" 
                  onChange={handleInputChange} 
                />
                
                <FormField 
                  label="Registration Time" 
                  name="Registration_Time" 
                  value={formData.Registration_Time} 
                  type="time" 
                  onChange={handleInputChange} 
                />
                
                <FormField 
                  label="Poruwa Ceremony Start" 
                  name="Poruwa_CeremonyFrom" 
                  value={formData.Poruwa_CeremonyFrom} 
                  type="time" 
                  onChange={handleInputChange} 
                />
                
                <FormField 
                  label="Poruwa Ceremony End" 
                  name="Poruwa_CeremonyTo" 
                  value={formData.Poruwa_CeremonyTo} 
                  type="time" 
                  onChange={handleInputChange} 
                />
                
                <SelectField 
                  label="Fountain" 
                  name="Fountain" 
                  value={formData.Fountain || "no"} 
                  onChange={handleInputChange} 
                  options={[
                    {value: 'yes', label: 'Yes'}, 
                    {value: 'no', label: 'No'}
                  ]} 
                />
                
                <SelectField 
                  label="Prosperity Table" 
                  name="ProsperityTable" 
                  value={formData.ProsperityTable || "no"} 
                  onChange={handleInputChange} 
                  options={[
                    {value: 'yes', label: 'Yes'}, 
                    {value: 'no', label: 'No'}
                  ]} 
                />
              </div>
            </div>
          )}
          
          {/* Conditional Custom Event Form */}
          {eventType === "custom" && (
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-4 text-purple-600">Custom Event Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField 
                  label="Event Name" 
                  name="Custom_Event_Name" 
                  value={formData.Custom_Event_Name} 
                  onChange={handleInputChange} 
                />
                
                <FormField 
                  label="Contact Person Name" 
                  name="ContactPersonName" 
                  value={formData.ContactPersonName} 
                  onChange={handleInputChange} 
                />
                
                <FormField 
                  label="Contact Person Number" 
                  name="ContactPersonNumber" 
                  value={formData.ContactPersonNumber} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-4 mt-6 flex justify-end items-center gap-3 sticky bottom-0">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">Saving...</span>
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                </>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Custom Confirmation Modal for Deletion
const ConfirmDeleteModal = ({ eventId, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
        <div className="flex items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Event</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete Event #{eventId}? This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onConfirm}
          >
            Confirm Delete
          </button>
          
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisplayEvents;