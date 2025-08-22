import React, { useEffect, useState, useRef } from 'react';

export const BookingTable = ({ bookings, onRowClick }) => {

  // Format ISO dates to readable
  const formatDate = (iso) => new Date(iso).toLocaleDateString();

  return (
    <div className="relative overflow-x-auto overflow-y-scroll shadow-md sm:rounded-lg mt-5" style={{ maxHeight: '450px' }}>
      {/* display venue table */}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className='px-6 py-3'>Booking ID</th>
            <th className='px-6 py-3'>Date</th>
            <th className='px-6 py-3'>Status</th>
            <th className='px-6 py-3'>Customer ID</th>
            <th className='px-6 py-3'>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr
              key={booking.booking_id}
              className={`cursor-pointer hover:bg-gray-300 ${booking.status === 'confirmed' &&
                new Date(booking.booking_date) > new Date() &&
                'bg-yellow-100 '
                }`}
              onClick={() => onRowClick(booking.booking_id)}
            >
              <td className="border px-6 py-4">{booking.booking_id}</td>
              <td className="border px-6 py-4">{formatDate(booking.booking_date)}</td>
              <td className="border px-6 py-4">{booking.status}</td>
              <td className="border px-6 py-4">{booking.customer_id}</td>
              <td className="border px-6 py-4">{booking.total_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}