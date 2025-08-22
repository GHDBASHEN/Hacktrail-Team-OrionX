import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaSpinner, FaFilter, FaSearch } from 'react-icons/fa';
import { downloadReportAPI, getAllBookingReports } from '../../services/EventService';

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState({});
    const [error, setError] = useState(null);
    
    // Filter states
    const [bookingDateFilter, setBookingDateFilter] = useState('');
    const [customerNameFilter, setCustomerNameFilter] = useState('');
    const [eventTypeFilter, setEventTypeFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await getAllBookingReports();
                setReports(data);
                setFilteredReports(data);
            } catch (err) {
                setError('Failed to load reports');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchReports();
    }, []);

    // Apply filters whenever filter states change
    useEffect(() => {
        let result = [...reports];
        
        // Apply booking date filter
        if (bookingDateFilter) {
            const filterDate = new Date(bookingDateFilter).toISOString().split('T')[0];
            result = result.filter(report => 
                report.booking_date.split('T')[0] === filterDate
            );
        }
        
        // Apply customers name filter
        if (customerNameFilter) {
            result = result.filter(report => 
                report.customer_name.toLowerCase().includes(customerNameFilter.toLowerCase())
            );
        }
        
        // Apply event type filter
        if (eventTypeFilter !== 'all') {
            if (eventTypeFilter === 'other') {
                result = result.filter(report => 
                    !report.event_type || 
                    !['wedding', 'custom'].includes(report.event_type.toLowerCase())
                );
            } else {
                result = result.filter(report => 
                    report.event_type && 
                    report.event_type.toLowerCase() === eventTypeFilter.toLowerCase()
                );
            }
        }
        
        setFilteredReports(result);
    }, [bookingDateFilter, customerNameFilter, eventTypeFilter, reports]);

    const handleDownload = async (bookingId) => {
        setDownloading(prev => ({ ...prev, [bookingId]: true }));
        try {
            const blob = await downloadReportAPI(bookingId);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Event-Report-${bookingId}.pdf`);
            document.body.appendChild(link);
            link.click();
            
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);
            
        } catch (err) {
            console.error(`Download failed for booking ${bookingId}:`, err);
            alert(`Download failed: ${err.message}`);
        } finally {
            setDownloading(prev => ({ ...prev, [bookingId]: false }));
        }
    };

    const getEventDetails = (report) => {
        if (!report.event_type) return 'No event details available';
        
        const eventType = report.event_type.toLowerCase();
        
        if (eventType === 'wedding') {
            return `Groom: ${report.Groom_Name || 'N/A'}, Bride: ${report.Bride_Name || 'N/A'}`;
        }
        if (eventType === 'custom') {
            return `${report.Event_Name || 'N/A'} (Contact: ${report.ContactPersonName || 'N/A'})`;
        }
        return 'No event details available';
    };

    const resetFilters = () => {
        setBookingDateFilter('');
        setCustomerNameFilter('');
        setEventTypeFilter('all');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-3xl text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong>Error:</strong> {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold">Event Reports</h1>
                
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={customerNameFilter}
                            onChange={(e) => setCustomerNameFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                    >
                        <FaFilter /> {showFilters ? 'Hide' : 'Filters'}
                    </button>
                </div>
            </div>
            
            {/* Filter Section */}
            {showFilters && (
                <div className="bg-white border border-gray-200 p-4 rounded-lg shadow mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Booking Date
                            </label>
                            <input
                                type="date"
                                value={bookingDateFilter}
                                onChange={(e) => setBookingDateFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Event Type
                            </label>
                            <select
                                value={eventTypeFilter}
                                onChange={(e) => setEventTypeFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Event Types</option>
                                <option value="wedding">Wedding</option>
                                <option value="custom">Custom Event</option>
                                <option value="other">Other Events</option>
                            </select>
                        </div>
                        
                        <div className="md:col-span-2 flex items-end justify-end">
                            <button
                                onClick={resetFilters}
                                className="w-full md:w-auto px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                    
                    {bookingDateFilter || customerNameFilter || eventTypeFilter !== 'all' ? (
                        <div className="mt-4 text-sm text-gray-600">
                            <span className="font-medium">Active filters:</span>
                            {bookingDateFilter && (
                                <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    Date: {new Date(bookingDateFilter).toLocaleDateString()}
                                </span>
                            )}
                            {customerNameFilter && (
                                <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    Customer: {customerNameFilter}
                                </span>
                            )}
                            {eventTypeFilter !== 'all' && (
                                <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    Type: {eventTypeFilter === 'other' ? 'Other Events' : eventTypeFilter}
                                </span>
                            )}
                        </div>
                    ) : null}
                </div>
            )}
            
            {/* Reports Table */}
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Booking ID</th>
                            <th className="py-3 px-4 text-left">Event ID</th>
                            <th className="py-3 px-4 text-left">Customer</th>
                            <th className="py-3 px-4 text-left">Contact</th>
                            <th className="py-3 px-4 text-left">Booking Date</th>
                            <th className="py-3 px-4 text-left">Event Type</th>
                            <th className="py-3 px-4 text-left">Event Details</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReports.map((report) => (
                            <tr 
                                key={report.booking_id} 
                                className="border-b hover:bg-gray-50"
                            >
                                <td className="py-3 px-4">{report.booking_id}</td>
                                <td className="py-3 px-4">{report.Event_ID || 'N/A'}</td>
                                <td className="py-3 px-4">
                                    <div className="font-medium">{report.customer_name}</div>
                                    <div className="text-sm text-gray-600">{report.email}</div>
                                </td>
                                <td className="py-3 px-4">{report.phone}</td>
                                <td className="py-3 px-4">
                                    {new Date(report.booking_date).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-4 capitalize">
                                    {report.event_type || 'N/A'}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                    {getEventDetails(report)}
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <button
                                        onClick={() => handleDownload(report.booking_id)}
                                        disabled={downloading[report.booking_id]}
                                        className={`flex items-center justify-center px-4 py-2 rounded transition-colors ${
                                            downloading[report.booking_id]
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                    >
                                        {downloading[report.booking_id] ? (
                                            <FaSpinner className="animate-spin mr-2" />
                                        ) : (
                                            <FaFilePdf className="mr-2" />
                                        )}
                                        Report
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {filteredReports.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                    {reports.length === 0 
                        ? 'No event reports found' 
                        : 'No reports match your filters'}
                </div>
            )}
            
            <div className="mt-4 text-sm text-gray-500">
                Showing {filteredReports.length} of {reports.length} records
            </div>
        </div>
    );
};

export default AdminReports;