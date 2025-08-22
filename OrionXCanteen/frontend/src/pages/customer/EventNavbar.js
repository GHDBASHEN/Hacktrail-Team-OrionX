import React from 'react';
import { FaBars } from 'react-icons/fa';

const EventNavbar = ({ toggleSidebar }) => {
    return (
        <nav className="bg-white shadow-md sticky top-0 z-20 md:hidden">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <div className="text-2xl font-bold text-gray-800">Event Home</div>
                    <button
                        onClick={toggleSidebar}
                        className="text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                        <FaBars size={24} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default EventNavbar;