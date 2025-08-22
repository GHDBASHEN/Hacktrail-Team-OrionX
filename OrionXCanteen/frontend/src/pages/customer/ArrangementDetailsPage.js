import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FiCoffee, 
  FiUsers, 
  FiCalendar, 
  FiDroplet, 
  FiStar, 
  FiAlertCircle,
  FiLoader
} from 'react-icons/fi';
import { getArrangementsByBooking } from '../../services/EventService';
import { decryptBookingId } from '../../utills/encryptionUtils';

const ArrangementDetailsPage = () => {
    const { bookingId: encryptedBookingId } = useParams();
    const [arrangements, setArrangements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const decryptedBookingId = decryptBookingId(encryptedBookingId);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getArrangementsByBooking(decryptedBookingId);
                setArrangements(data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        if (decryptedBookingId) {
            fetchData();
        }
    }, [decryptedBookingId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <FiLoader className="animate-spin text-4xl text-indigo-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <div className="text-center text-red-600 max-w-md p-4">
                    <FiAlertCircle className="text-4xl mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!arrangements.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-600">
                    <FiCoffee className="text-4xl mx-auto mb-4" />
                    <h2 className="text-xl font-semibold">No Arrangements Found for This Booking</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                        <FiCoffee className="text-indigo-600" />
                        Table Arrangement Details
                    </h1>
                    <p className="text-gray-500">Booking ID: {decryptedBookingId}</p>
                </div>

                {arrangements.map((arrangement) => (
                    <div key={arrangement.Arrangement_ID} className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="p-4 bg-indigo-50 rounded-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <FiStar className="text-indigo-600 text-xl" />
                                    <h3 className="font-semibold text-gray-800">Head Table</h3>
                                </div>
                                <p className="text-2xl font-bold text-indigo-600">
                                    {arrangement.Head_Table_Pax || 0} Guests
                                </p>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <FiCalendar className="text-blue-600 text-xl" />
                                    <h3 className="font-semibold text-gray-800">Last Updated</h3>
                                </div>
                                <p className="text-lg text-blue-600">
                                    {new Date(arrangement.UpdatedAt).toLocaleDateString('en-US', {
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <FiDroplet className="text-purple-600" />
                                Color Scheme
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(arrangement.Colors || {}).map(([category, color]) => (
                                    <div key={category} className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div 
                                                className="w-4 h-4 rounded-full border"
                                                style={{ backgroundColor: color || '#ffffff' }}
                                            ></div>
                                            <span className="text-sm text-gray-600 capitalize">
                                                {category}
                                            </span>
                                        </div>
                                        <p className="font-medium text-gray-800">{color || 'Not set'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <FiUsers className="text-green-600" />
                                Table Reservations
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {(arrangement.Reservations || []).map((reservation) => (
                                    <div 
                                        key={reservation.Table_Reserve_ID}
                                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-indigo-100 p-2 rounded-lg">
                                                <FiCoffee className="text-indigo-600 text-xl" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Table #{reservation.Table_Number || 'N/A'}
                                                </p>
                                                <p className="font-semibold text-gray-800">
                                                    {reservation.Reserve_Name || 'Unnamed Reservation'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArrangementDetailsPage;