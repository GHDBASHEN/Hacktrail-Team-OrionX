import React, { useState, useEffect, useContext } from 'react';
import ProfileNavbar from '../components/ProfileNavbar';
import ProfileSideNav from '../components/ProfileSideNav';
import CustomerBookings from './customers/CustomerBooking';
import { FaCalendarCheck, FaTasks, FaRegClock } from 'react-icons/fa';
import { Loader2, AlertCircle } from 'lucide-react';
import { getTotalCustomerBookings } from '../services/EventService';
import { AuthContext } from '../context/Authcontext';

const Card = ({ title, value, icon, color }) => (
    <div className={`p-6 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300 ${color}`}>
        <div className="flex items-center">
            <div className="mr-4 text-white text-3xl">{icon}</div>
            <div>
                <p className="text-white font-semibold">{title}</p>
                <h3 className="text-2xl font-bold text-white">{value}</h3>
            </div>
        </div>
    </div>
);

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [activePage, setActivePage] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [bookingStats, setBookingStats] = useState({
        days_remaining: 0,
        total_upcoming_bookings: 0,
        total_completed_bookings: 0,
    });

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

        const fetchBookingStats = async () => {
            try {
                const data = await getTotalCustomerBookings(customerID);
                if (Array.isArray(data) && data.length > 0) {
                    setBookingStats(data[0]);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching booking stats:", err);
                setError("Failed to load booking stats. Please try again later.");
                setLoading(false);
            }
        };

        fetchBookingStats();
    }, [user]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-red-500 bg-red-50 rounded-lg p-6">
                    <AlertCircle className="w-12 h-12 mb-4" />
                    <p className="text-xl font-medium">{error}</p>
                </div>
            );
        }

        switch (activePage) {
            case 'plan-event':
                return <CustomerBookings />;
            case 'dashboard':
            default:
                return (
                    <div>
                        <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Overview</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <Card
                                title="Upcoming Events"
                                value={bookingStats.total_upcoming_bookings}
                                icon={<FaCalendarCheck />}
                                color="bg-gradient-to-r from-blue-500 to-blue-400"
                            />
                            <Card
                                title="Completed Events"
                                value={bookingStats.total_completed_bookings}
                                icon={<FaTasks />}
                                color="bg-gradient-to-r from-green-500 to-green-400"
                            />
                            <Card
                                title="Days Until Next Event"
                                value={
                                    bookingStats.days_remaining !== null && bookingStats.days_remaining !== undefined
                                        ? bookingStats.days_remaining
                                        : '0'
                                }
                                icon={<FaRegClock />}
                                color="bg-gradient-to-r from-red-500 to-red-400"
                            />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ProfileNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex">
                <ProfileSideNav
                    activePage={activePage}
                    setActivePage={setActivePage}
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300">
                    <div className="bg-white shadow-md rounded-xl p-6">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Profile;
