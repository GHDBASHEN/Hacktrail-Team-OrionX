import React, { useState, useEffect } from 'react';
import BookingPrintView from '../../components/bookings/BookingPrintView';
import { getBookings, searchBookingBy, searchBookings } from '../../services/BookngService'; // You'll need to create this service

const InvoiceView = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useState({
    booking_id: '',
    customer_id: '',
    from_date: '',
    to_date: '',
  });

  const searchbooking = async () => {
    try {
      // Filter out empty search parameters
      const params = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '')
      );

      if (params) {
        const data = await searchBookingBy(params.customer_id || params.booking_id);
        setBookings(data.data);
      }
    } catch (error) {
      console.log("err");
    }
  }

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      setBookings(data.data);

      setError(null);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchbooking();
  };

  const handleResetSearch = () => {
    setSearchParams({
      booking_id: '',
      customer_id: '',
      from_date: '',
      to_date: '',
    });
    fetchBookings();
  };

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (selectedBookingId) {
    return (
      <BookingPrintView
        bookingId={selectedBookingId}
        onBack={() => setSelectedBookingId(null)}
      />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Invoice Management</h1>

      {/* Search Section */}
      {/* <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Search Bookings</h2>
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Booking ID</label>
            <input
              type="text"
              name="booking_id"
              value={searchParams.booking_id}
              onChange={handleSearchChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter Booking ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
            <input
              type="text"
              name="customer_id"
              value={searchParams.customer_id}
              onChange={handleSearchChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter Customer ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              name="from_date"
              value={searchParams.from_date}
              onChange={handleSearchChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              name="to_date"
              value={searchParams.to_date}
              onChange={handleSearchChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="md:col-span-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleResetSearch}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </form>
      </div> */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Bookings</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filters
          </button>
        </div>

        {showFilters && (
          <form onSubmit={handleSearchSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking ID</label>
              <input
                type="text"
                name="booking_id"
                value={searchParams.booking_id}
                onChange={handleSearchChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter Booking ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
              <input
                type="text"
                name="customer_id"
                value={searchParams.customer_id}
                onChange={handleSearchChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter Customer ID"
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                name="from_date"
                value={searchParams.from_date}
                onChange={handleSearchChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                name="to_date"
                value={searchParams.to_date}
                onChange={handleSearchChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div> */}

            <div className="md:col-span-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleResetSearch}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading bookings...</div>
        ) : error ? (
          <div className="p-8 text-red-600 text-center">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto overflow-y-scroll max-h-[500px]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.length > 0 ? (
                    bookings.map(booking => (
                      <tr key={booking.booking_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.booking_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(booking.booking_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.customer_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Rs. {booking.overall_total?.toLocaleString('en-US') || '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedBookingId(booking.booking_id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Invoice
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No bookings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InvoiceView;