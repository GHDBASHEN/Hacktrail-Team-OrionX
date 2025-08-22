import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getBookings, updateBookingPrice_BiteSoftLiquor } from '../../services/BookngService';
import BookingDetailsView from '../../components/bookings/BookingDetailsView';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, isSameDay, isSameMonth, isToday } from 'date-fns';

// Status colors mapping
const STATUS_COLORS = {
  confirmed: 'bg-green-100 border-green-500',
  pending: 'bg-yellow-100 border-yellow-500',
  cancelled: 'bg-red-100 border-red-500',
  done: 'bg-blue-100 border-blue-500'
};

// Filter icon SVG
const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
  </svg>
);

export default function CalenderView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBookings("all");
      const processedBookings = data.data.map(b => ({
        ...b,
        date: new Date(b.booking_date),
        formattedDate: format(new Date(b.booking_date), 'MMM dd, yyyy')
      }));
      setBookings(processedBookings);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Add refresh handler
  const handleRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  // Add refresh icon component
  const RefreshIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
    </svg>
  );


  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = new Date(day);
      day.setDate(day.getDate() + 1);
    }
    return days;
  }, [currentMonth]);

  // Get bookings for specific date
  const getDateBookings = (date) => {
    return bookings.filter(b =>
      isSameDay(b.date, date) &&
      (statusFilter === 'all' || b.status === statusFilter)
    );
  };

  // Group bookings by status
  const getStatusSummary = (date) => {
    const dateBookings = getDateBookings(date);
    return dateBookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {});
  };

  const changeMonth = (offset) => {
    setCurrentMonth(addMonths(currentMonth, offset));
  };

  const handleDateClick = (day) => {
    const dateBookings = getDateBookings(day);
    if (dateBookings.length > 0) {
      setSelectedDate(day);
    }
  };

  const handleBookingClick = (booking) => {
    updateBookingPrice_BiteSoftLiquor(booking.booking_id);
    setSelectedBooking(booking.booking_id);
    setSelectedDate(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 px-20">
      {/* Calendar Header - More Compact */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
          >
            ←
          </button>
          <h2 className="text-xl font-bold text-gray-800 min-w-[180px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
          >
            →
          </button>
        </div>

        <div className="flex gap-2">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${loading || refreshing
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gray-100 hover:bg-gray-200'
              }`}
          >
            {refreshing || loading ? (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <RefreshIcon className="h-5 w-5" />
            )}
            <span>Refresh</span>
          </button>

          {/* Existing Filter Button */}
          <div className="relative">
            {/* ... existing filter button code ... */}
          </div>
        </div>

        {/* Filter Button */}
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full"
          >
            <FilterIcon />
            <span className="capitalize">{statusFilter === 'all' ? 'All Bookings' : statusFilter}</span>
          </button>

          {/* Filter Dropdown */}
          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button
                className={`block w-full text-left px-4 py-2 text-sm ${statusFilter === 'all' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                onClick={() => {
                  setStatusFilter('all');
                  setShowFilterDropdown(false);
                }}
              >
                All Bookings
              </button>
              {Object.keys(STATUS_COLORS).map(status => (
                <button
                  key={status}
                  className={`block w-full text-left px-4 py-2 text-sm capitalize ${statusFilter === status ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                  onClick={() => {
                    setStatusFilter(status);
                    setShowFilterDropdown(false);
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 p-1">
            {day}
          </div>
        ))}
      </div>

      {
        loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              const dayBookings = getDateBookings(day);
              const statusSummary = getStatusSummary(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);

              return (
                <div
                  key={idx}
                  onClick={() => handleDateClick(day)}
                  className={`min-h-24 p-1 rounded-lg border flex flex-col transition-all hover:shadow-md
                  ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                  ${isToday(day) ? 'border-2 border-blue-500' : 'border-gray-200'}
                  ${dayBookings.length > 0 ? 'hover:bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-sm ${isToday(day) ? 'text-blue-600 font-bold' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    {dayBookings.length > 0 && (
                      <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {dayBookings.length}
                      </span>
                    )}
                  </div>

                  {/* Status Indicators */}
                  <div className="mt-1 flex flex-wrap gap-0.5">
                    {Object.entries(statusSummary).map(([status, count]) => (
                      <span
                        key={status}
                        className={`text-[8px] px-1 py-0.5 rounded ${STATUS_COLORS[status] || 'bg-gray-200'}`}
                      >
                        {count} {status}
                      </span>
                    ))}
                  </div>

                  {/* Booking Preview */}
                  <div className="mt-auto space-y-0.5 max-h-16 overflow-y-auto">
                    {dayBookings.slice(0, 2).map(booking => (
                      <div
                        key={booking.booking_id}
                        className={`text-[10px] p-0.5 rounded truncate cursor-pointer ${STATUS_COLORS[booking.status] || 'bg-gray-200'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookingClick(booking);
                        }}
                      >
                        <div className="font-semibold truncate p-2">{booking.customer_id?.split(' ')[0] || 'Customer'}</div>
                        {/* <div className="text-gray-600 truncate">{booking.venue_id?.split(' ')[0] || 'Venue'}</div> */}
                      </div>
                    ))}
                    {dayBookings.length > 2 && (
                      <div className="text-[10px] text-gray-500">+{dayBookings.length - 2} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      }

      {/* Booking Details Modal */}
      {
        selectedBooking && (
          <BookingDetailsView
            bookingId={selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />
        )
      }

    </div >
  );
}