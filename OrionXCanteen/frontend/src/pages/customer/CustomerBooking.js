import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/Authcontext";
import { getCustomerBookings } from "../../services/EventService";
import { useNavigate } from "react-router-dom";
import { encryptBookingId, encryptCustId } from "../../utills/encryptionUtils";
import { Calendar, User, ArrowRight, Loader2, AlertCircle } from "lucide-react";

const CustomerBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let customerID = sessionStorage.getItem("id");
        if (!customerID && user) customerID = user.id;

        if (!customerID) {
            setError("Customer ID not found. Please log in again.");
            setLoading(false);
            return;
        }

        getCustomerBookings(customerID)
            .then(data => {
                setBookings(data);
                setLoading(false);
            })
            .catch(error => {
                setError("Failed to load your bookings. Please try again later.");
                setLoading(false);
            });
    }, [user]);

    const formatDate = (isoDate) => {
        if (!isoDate) return "Date not available";
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-64 text-red-500 bg-red-50 rounded-lg p-6">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p className="text-xl font-medium">{error}</p>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Bookings
            </h2>

            {bookings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-md">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">You have no upcoming events.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {/* We get the 'index' from map to number the bookings */}
                    {bookings.map((booking, index) => (
                        <div 
                            key={booking.booking_id} 
                            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
                        >
                            <div className="p-6 flex-grow">
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="flex-shrink-0 bg-gradient-to-tr from-blue-500 to-purple-500 p-3 rounded-full text-white">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    {/* Display booking number using the index */}
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        Booking {index + 1}
                                    </h3>
                                </div>

                                <div className="space-y-3 border-l-2 border-blue-100 pl-4 ml-5">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <User className="w-5 h-5 text-blue-400" />
                                        {/* Display customers name. Provide a fallback in case it's null. */}
                                        <span className="font-medium">Customer : {booking.customer_name || 'Valued Customer'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Calendar className="w-5 h-5 text-blue-400" />
                                        <span className="font-medium">Event Date : {formatDate(booking.booking_date)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t-2 border-gray-100 p-4 bg-gray-50 rounded-b-xl">
                                <button
                                    onClick={() => {
                                        localStorage.setItem('bookingId', booking.booking_id);
                                        const encryptedId = encryptBookingId(booking.booking_id);
                                        const encryptedCustomerId = encryptCustId(booking.customer_id);
                                        navigate(`/eventHome/${encryptedId}/${encryptedCustomerId}`);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-1 transition-all duration-300"
                                >
                                    Plan Your Event
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerBookings;