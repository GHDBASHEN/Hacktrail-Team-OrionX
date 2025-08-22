import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getAllEvents, updateEvent, deleteEvent } from '../../services/EventService';
import GetAllEvents from './GetAllEvents';
import { FaRegCalendarAlt, FaRegClock, FaUsers, FaTag, FaRegBuilding, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';

const eventNameSchema = Yup.string().test(
    'event-name',
    'Event name is required for custom events',
    function (value) {
        const { Event_Type } = this.parent;
        return Event_Type === 'custom' ? !!value : true;
    }
);

const eventSchema = Yup.object().shape({
    Event_Name: eventNameSchema,
    Event_Date: Yup.date().required('Event date is required'),
    Event_Type: Yup.string().required('Event type is required'),
    details: Yup.object()
        .test('event-details', 'Details validation failed', function (details) {
            const { Event_Type } = this.parent;

            if (Event_Type === 'wedding') {
                const weddingSchema = Yup.object().shape({
                    groomName: Yup.string().required("Groom's name is required"),
                    brideName: Yup.string().required("Bride's name is required"),
                });
                return weddingSchema.isValid(details);
            }
            else {
                const customSchema = Yup.object().shape({
                    contactPersonName: Yup.string().required('Contact person is required'),
                    contactPersonNumber: Yup.string().required('Contact number is required')
                });
                return customSchema.isValid(details);
            }
        })
});

const SeeEvents = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editEvent, setEditEvent] = useState(null);
    const [filters, setFilters] = useState({
        searchQuery: '',
        eventType: 'all',
        year: '',
        month: ''
    });

    const handleRowClick = (event) => setSelectedEvent(event);
    const closePopup = () => setSelectedEvent(null);

    const getDateFilters = () => {
        const years = new Set();
        const months = new Set();
        events.forEach(event => {
            const date = new Date(event.Event_Date);
            years.add(date.getFullYear());
            months.add(date.getMonth() + 1);
        });
        return {
            years: Array.from(years).sort((a,b) => b - a),
            months: Array.from(months).sort((a, b) => a - b)
        };
    };
    const { years, months } = getDateFilters();

    const filteredEvents = events.filter(event => {
        if (!event) return false;
        const date = new Date(event.Event_Date);
        const searchTerm = filters.searchQuery.toLowerCase();
        const matchesSearch = [
            event.Event_Name, event.details?.eventName, event.details?.groomName,
            event.details?.brideName, event.details?.contactPersonName
        ].some(field => (field || '').toLowerCase().includes(searchTerm));

        return (
            (filters.eventType === 'all' || event.eventType === filters.eventType) &&
            (!filters.year || date.getFullYear() === parseInt(filters.year)) &&
            (!filters.month || (date.getMonth() + 1) === parseInt(filters.month)) &&
            matchesSearch
        );
    });

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await getAllEvents();
                // Add eventType if missing
                const enhancedData = data.map(event => {
                    if (!event.eventType) {
                        if (event.details?.groomName) {
                            return { ...event, eventType: 'wedding' };
                        } else if (event.details?.contactPersonName) {
                            return { ...event, eventType: 'custom' };
                        }
                        // Default to custom if type can't be determined
                        return { ...event, eventType: 'custom' };
                    }
                    return event;
                });
                setEvents(enhancedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, []);

    const handleUpdate = async (values) => {
        try {
            // Ensure we have valid event type
            const eventType = values.Event_Type || (values.details?.groomName ? 'wedding' : 'custom');
            
            const payload = {
                Event_Name: values.Event_Name,
                Event_Date: values.Event_Date,
                Event_Type: eventType,
                details: {
                    ...values.details,
                    // Wedding specific
                    groomName: values.details.groomName || '',
                    brideName: values.details.brideName || '',
                    groomContact: values.details.groomContact || '',
                    brideContact: values.details.brideContact || '',
                    fountain: values.details.fountain || '',
                    prosperityTable: values.details.prosperityTable || '',
                    // Custom specific
                    contactPersonName: values.details.contactPersonName || '',
                    contactPersonNumber: values.details.contactPersonNumber || '',
                    eventName: values.Event_Name || '',
                },
                // Time fields
                Buffet_TimeFrom: values.details.buffetTimeFrom || null,
                Buffet_TimeTo: values.details.buffetTimeTo || null,
                Additional_Time: values.details.additionalTime || null,
                Function_durationFrom: values.details.functionDurationFrom || null,
                Function_durationTo: values.details.functionDurationTo || null,
                Tea_table_Time: values.details.teaTableTime || null,
                Dress_Time: values.details.dressTime || null,
            };

            const updatedEvent = await updateEvent(editEvent.Event_ID, payload);
            
            // Update local state
            setEvents(prev => prev.map(e => 
                e.Event_ID === editEvent.Event_ID ? { ...e, ...updatedEvent } : e
            ));
            
            setEditEvent(null);
            setSuccess('Event updated successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to update event');
        }
    };

    const formatTimeForInput = (timeString) => {
        if (!timeString) return '';
        // Handle both full time strings and HH:mm formats
        return timeString.includes(':') 
            ? timeString.substring(0, 5) 
            : timeString;
    };

    const handleDelete = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await deleteEvent(eventId);
                setEvents(prev => prev.filter(event => event.Event_ID !== eventId));
                setSuccess('Event deleted successfully');
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError(err.message || 'Failed to delete event');
            }
        }
    };

    const formatEventDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: '2-digit', 
            year: 'numeric' 
        });
    };

    if (loading) {
        return <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {error && <div className="bg-red-100 text-red-800 p-4 rounded-lg">{error}</div>}
            {success && <div className="bg-green-100 text-green-800 p-4 rounded-lg">{success}</div>}
            
            {selectedEvent && <GetAllEvents event={selectedEvent} onClose={closePopup} />}

            {/* EDIT MODAL */}
            {editEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-bold text-gray-800">Edit Event</h3>
                            <button onClick={() => setEditEvent(null)} className="text-gray-400 hover:text-gray-600">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <Formik
                            initialValues={{
                                Event_Name: editEvent.Event_Name || editEvent.CustomEvent_Name || '',
                                Event_Date: editEvent.Event_Date ? new Date(editEvent.Event_Date).toISOString().split('T')[0] : '',
                                Event_Type: editEvent.eventType || 'custom',
                                details: {
                                    ...editEvent.details,
                                    // Wedding specific
                                    groomName: editEvent.details?.groomName || '',
                                    brideName: editEvent.details?.brideName || '',
                                    poruwaCeremonyFrom: formatTimeForInput(editEvent.details?.poruwaCeremonyFrom || ''),
                                    poruwaCeremonyTo: formatTimeForInput(editEvent.details?.poruwaCeremonyTo || ''),
                                    registrationTime: formatTimeForInput(editEvent.details?.registrationTime || ''),
                                    groomContact: editEvent.details?.groomContact || '',
                                    brideContact: editEvent.details?.brideContact || '',
                                    fountain: editEvent.details?.fountain || '',
                                    prosperityTable: editEvent.details?.prosperityTable || '',
                                    groomAddress: editEvent.details?.groomAddress || '',
                                    brideAddress: editEvent.details?.brideAddress || '',
                                    // Custom specific
                                    contactPersonName: editEvent.details?.contactPersonName || '',
                                    contactPersonNumber: editEvent.details?.contactPersonNumber || '',
                                    eventName: editEvent.details?.eventName || editEvent.Event_Name || '',
                                    // Time fields
                                    buffetTimeFrom: formatTimeForInput(editEvent.Buffet_TimeFrom || ''),
                                    buffetTimeTo: formatTimeForInput(editEvent.Buffet_TimeTo || ''),
                                    additionalTime: formatTimeForInput(editEvent.Additional_Time || ''),
                                    functionDurationFrom: formatTimeForInput(editEvent.Function_durationFrom || ''),
                                    functionDurationTo: formatTimeForInput(editEvent.Function_durationTo || ''),
                                    teaTableTime: formatTimeForInput(editEvent.Tea_table_Time || ''),
                                    dressTime: formatTimeForInput(editEvent.Dress_Time || ''),
                                }
                            }}
                            validationSchema={eventSchema}
                            onSubmit={handleUpdate}
                        >
                            {({ values, isSubmitting }) => (
                                <Form className="flex flex-col flex-grow">
                                    {/* Make this div scrollable */}
                                    <div className="flex-grow overflow-y-auto p-6 space-y-6" style={{ maxHeight: '60vh' }}>
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-gray-600 border-b pb-2">Event Details</h4>
                                            {values.Event_Type === 'custom' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Event Name</label>
                                                    <Field 
                                                        name="Event_Name" 
                                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                                                    />
                                                    <ErrorMessage name="Event_Name" component="div" className="text-red-500 text-sm mt-1" />
                                                </div>
                                            )}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Event Date</label>
                                                    <Field 
                                                        type="date" 
                                                        name="Event_Date" 
                                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                                                    />
                                                    <ErrorMessage name="Event_Date" component="div" className="text-red-500 text-sm mt-1" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Event Type</label>
                                                    <Field 
                                                        as="select" 
                                                        name="Event_Type" 
                                                        disabled 
                                                        className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                                                    >
                                                        <option value="wedding">Wedding</option>
                                                        <option value="custom">Custom Event</option>
                                                    </Field>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-gray-600 border-b pb-2">
                                                {values.Event_Type === 'wedding' ? 'Wedding Specifics' : 'Custom Event Details'}
                                            </h4>
                                            {values.Event_Type === 'wedding' ? (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Groom's Name</label>
                                                            <Field 
                                                                name="details.groomName" 
                                                                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" 
                                                            />
                                                            <ErrorMessage name="details.groomName" component="div" className="text-red-500 text-sm mt-1" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Bride's Name</label>
                                                            <Field 
                                                                name="details.brideName" 
                                                                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" 
                                                            />
                                                            <ErrorMessage name="details.brideName" component="div" className="text-red-500 text-sm mt-1" />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Groom's Contact</label>
                                                            <Field 
                                                                name="details.groomContact" 
                                                                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" 
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Bride's Contact</label>
                                                            <Field 
                                                                name="details.brideContact" 
                                                                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Groom's Address</label>
                                                            <Field 
                                                                name="details.groomAddress" 
                                                                as="textarea"
                                                                rows="2"
                                                                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Bride's Address</label>
                                                            <Field 
                                                                name="details.brideAddress" 
                                                                as="textarea"
                                                                rows="2"
                                                                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Fountain</label>
                                                            <Field as="select" name="details.fountain" className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm">
                                                                <option value="">Select</option>
                                                                <option value="yes">Yes</option>
                                                                <option value="no">No</option>
                                                            </Field>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Prosperity Table</label>
                                                            <Field as="select" name="details.prosperityTable" className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm">
                                                                <option value="">Select</option>
                                                                <option value="yes">Yes</option>
                                                                <option value="no">No</option>
                                                            </Field>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Poruwa Ceremony (From - To)</label>
                                                            <div className="flex gap-2">
                                                                <Field type="time" name="details.poruwaCeremonyFrom" className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
                                                                <Field type="time" name="details.poruwaCeremonyTo" className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Registration Time</label>
                                                            <Field type="time" name="details.registrationTime" className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                                                        <Field 
                                                            name="details.contactPersonName" 
                                                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" 
                                                        />
                                                        <ErrorMessage name="details.contactPersonName" component="div" className="text-red-500 text-sm mt-1" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                                                        <Field 
                                                            name="details.contactPersonNumber" 
                                                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" 
                                                        />
                                                        <ErrorMessage name="details.contactPersonNumber" component="div" className="text-red-500 text-sm mt-1" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-gray-600 border-b pb-2">Timings</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Function Duration</label>
                                                    <div className="flex gap-2">
                                                        <Field 
                                                            type="time" 
                                                            name="details.functionDurationFrom" 
                                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" 
                                                        />
                                                        <Field 
                                                            type="time" 
                                                            name="details.functionDurationTo" 
                                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" 
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Buffet Time</label>
                                                    <div className="flex gap-2">
                                                        <Field 
                                                            type="time" 
                                                            name="details.buffetTimeFrom" 
                                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" 
                                                        />
                                                        <Field 
                                                            type="time" 
                                                            name="details.buffetTimeTo" 
                                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" 
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Tea Table Time</label>
                                                    <Field 
                                                        type="time" 
                                                        name="details.teaTableTime" 
                                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" 
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Dressing Time</label>
                                                    <Field 
                                                        type="time" 
                                                        name="details.dressTime" 
                                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" 
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Additional Time</label>
                                                    <Field 
                                                        type="time" 
                                                        name="details.additionalTime" 
                                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0 p-6 border-t bg-gray-50 rounded-b-2xl">
                                        <div className="flex justify-end gap-4">
                                            <button 
                                                type="button" 
                                                onClick={() => setEditEvent(null)} 
                                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                type="submit" 
                                                disabled={isSubmitting} 
                                                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50"
                                            >
                                                {isSubmitting ? 'Updating...' : 'Update Event'}
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}

            {/* EVENTS TABLE */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="w-full md:w-auto flex-grow">
                        <input 
                            type="text" 
                            placeholder="Search by name or ID..." 
                            value={filters.searchQuery} 
                            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })} 
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-200" 
                        />
                    </div>
                    <div className="w-full sm:w-auto">
                        <select 
                            value={filters.eventType} 
                            onChange={(e) => setFilters({ ...filters, eventType: e.target.value })} 
                            className="w-full px-4 py-2 rounded-lg border border-gray-300"
                        >
                            <option value="all">All Types</option>
                            <option value="wedding">Weddings</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                    <div className="w-full sm:w-auto">
                        <select 
                            value={filters.year} 
                            onChange={(e) => setFilters({ ...filters, year: e.target.value })} 
                            className="w-full px-4 py-2 rounded-lg border border-gray-300"
                        >
                            <option value="">All Years</option>
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full sm:w-auto">
                        <select 
                            value={filters.month} 
                            onChange={(e) => setFilters({ ...filters, month: e.target.value })} 
                            className="w-full px-4 py-2 rounded-lg border border-gray-300"
                        >
                            <option value="">All Months</option>
                            {months.map(month => (
                                <option key={month} value={month}>
                                    {new Date(2000, month - 1).toLocaleString('default', { month: 'short' })}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredEvents.length > 0 ? filteredEvents.map(event => (
                                <tr 
                                    key={event.Event_ID} 
                                    className="hover:bg-gray-50 transition-colors cursor-pointer" 
                                    onClick={() => handleRowClick(event)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {event.eventType === 'wedding' 
                                            ? `${event.details?.groomName || 'N/A'} & ${event.details?.brideName || 'N/A'}` 
                                            : event.details?.eventName || event.Event_Name || 'Untitled Event'
                                        }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1.5 text-xs font-medium capitalize rounded-full ${event.eventType === 'wedding' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {event.eventType || 'custom'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {formatEventDate(event.Event_Date)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {event.eventType === 'wedding' 
                                            ? `${event.details?.groomName || 'N/A'} ( Groom ) : ${event.details?.groomContact || 'N/A'}` 
                                            : ` ${event.details?.contactPersonName || 'N/A'} ( Contact ) : ${event.details?.contactPersonNumber || 'N/A'}`
                                        }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button 
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                setEditEvent(event); 
                                            }} 
                                            className="text-indigo-600 hover:text-indigo-900 mr-4" 
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                handleDelete(event.Event_ID); 
                                            }} 
                                            className="text-red-600 hover:text-red-900" 
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        {events.length === 0 ? 'No events have been created yet.' : 'No events match your current filters.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SeeEvents;