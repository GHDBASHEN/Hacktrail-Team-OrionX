import React, { useEffect, useState } from 'react';
import { getBookingDetails, getBookings, searchBookingBy, updateBookingPrice_BiteSoftLiquor, updateContract } from '../../services/BookngService';
import { StatusFilter } from '../../components/bookings/StatusFilter';
import { BookingTable } from '../../components/bookings/BookingTable';
import BookingDetailsView from '../../components/bookings/BookingDetailsView';

const BookingsAnalyze = () => {
    const [status, setStatus] = useState('all');
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [color, setColor] = useState(null);
    const [serchBy, setSerchBy] = useState("");

    useEffect(() => {
        fetchBookings();
    }, [status]);

    useEffect(() => {
        searchBooking();
    }, [serchBy]);

    // Fetch bookings data called inside useEffect
    const fetchBookings = async () => {
        const data = await getBookings(status);
        setBookings(data.data);
    };

    const searchBooking = async () => {
        const data = await searchBookingBy(serchBy);
        setBookings(data.data);
    }

    const handleRowClick = (id) => {
        // Update bite & soft & Liquor drink price when a row is clicked 
        updateBookingPrice_BiteSoftLiquor(id)
            .then(() => console.log("Bites, soft drink, and liquor prices updated"))
            .catch((error) => console.error("Error updating prices:", error));
        getBookingDetails(id).then((data) => setSelectedBooking(data.data));
    };

    

    return (
        <div className="p-6">
            <StatusFilter currentStatus={status} onChange={setStatus} onSearch={setSerchBy} serchBy={serchBy}/>
            <BookingTable bookings={bookings} onRowClick={handleRowClick} />
            {selectedBooking && (
                <BookingDetailsView 
                    bookingId={selectedBooking.booking_id} 
                    onClose={() => setSelectedBooking(null)}
                    color={color}
                    setColor={setColor}
                />
            )}
        </div>
    );
};

export default BookingsAnalyze;
