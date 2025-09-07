import React from 'react';
import { FaBars } from 'react-icons/fa';

const ProfileNavbar = ({ toggleSidebar }) => {
    return (
        <nav className="bg-white shadow-md sticky top-0 z-20">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <div className="text-2xl font-bold text-gray-800">My Profile</div>
                    <div className="md:hidden">
                        <button
                            onClick={toggleSidebar}
                            className="text-gray-600 hover:text-gray-800 focus:outline-none"
                        >
                            <FaBars size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default ProfileNavbar;