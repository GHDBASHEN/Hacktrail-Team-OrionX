import React from 'react';
import { Logout } from '../components/Logout';
import { FaTachometerAlt, FaCalendarAlt, FaTimes } from 'react-icons/fa';

const NavLink = ({ icon, text, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
    >
        {icon}
        <span className="ml-4">{text}</span>
    </button>
);

const ProfileSideNav = ({ activePage, setActivePage, isOpen, setIsOpen }) => {
    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden ${isOpen ? 'block' : 'hidden'}`}
                onClick={() => setIsOpen(false)}
            ></div>

            <aside
                className={`bg-gray-800 text-white w-64 min-h-screen fixed top-0 left-0 z-40 transform ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
            >
                <div className="flex justify-between items-center p-4 md:hidden">
                    <h2 className="text-xl font-bold">Menu</h2>
                    <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">
                        <FaTimes size={24} />
                    </button>
                </div>

                <nav className="mt-5 flex flex-col justify-between h-[calc(100vh-4rem)]">
                    <div>
                        <NavLink
                            icon={<FaTachometerAlt />}
                            text="Dashboard"
                            onClick={() => {
                                setActivePage('dashboard');
                                if (window.innerWidth < 768) setIsOpen(false);
                            }}
                        />
                        <div className="border-t border-gray-700 my-2"></div>
                        <NavLink
                            icon={<FaCalendarAlt />}
                            text="Event Planning"
                            onClick={() => {
                                setActivePage('plan-event');
                                if (window.innerWidth < 768) setIsOpen(false);
                            }}
                        />
                    </div>
                    <div className="border-t border-gray-700">
                        <div className="px-4 py-3 text-gray-300 hover:bg-gray-700 cursor-pointer">
                            <Logout />
                        </div>
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default ProfileSideNav;