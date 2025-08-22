import React, { useState } from 'react';
import { Logout } from '../../components/Logout';
import {
    FaChartPie, FaCalendarPlus, FaUtensils, FaConciergeBell,
    FaChair, FaCocktail, FaChevronDown, FaChevronUp, FaTimes
} from 'react-icons/fa';

// The NavItem no longer manages its own state. It's controlled by the parent.
const NavItem = ({ name, icon, children, subItems, openMenu, setOpenMenu, setActivePage, closeSidebar }) => {
    // This item is open if its name matches the parent's openMenu state.
    const isOpen = openMenu === name;

    const handleToggle = () => {
        // If it's already open, close it. Otherwise, open it.
        setOpenMenu(isOpen ? null : name);
    };

    return (
        <div>
            <button
                onClick={handleToggle}
                className="w-full flex items-center justify-between px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-all duration-200"
            >
                <div className="flex items-center">
                    <div className="mr-4 text-lg">{icon}</div>
                    <span className="font-medium">{children}</span>
                </div>
                {subItems && (isOpen ? <FaChevronUp /> : <FaChevronDown />)}
            </button>
            {isOpen && subItems && (
                <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-600 pl-4">
                    {subItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setActivePage(item.page);
                                closeSidebar();
                            }}
                            className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-md transition-colors duration-150"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const EventHomeSideNav = ({ setActivePage, isOpen, setIsOpen }) => {
    // State is "lifted up" to this parent component.
    // It holds the name of the currently open menu, e.g., 'events' or 'menu'.
    const [openMenu, setOpenMenu] = useState(null);

    const closeSidebar = () => {
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    };

    // Data for the navigation items
    const navItemsData = [
        { name: 'events', icon: <FaCalendarPlus className="text-blue-400" />, title: 'Plan Events', subItems: [
            { page: 'plan-event', label: '✨ Plan New Event' },
            { page: 'view-events', label: '📅 View Events' }
        ]},
        { name: 'menu', icon: <FaUtensils className="text-orange-400" />, title: 'Menu Planning', subItems: [
            { page: 'plan-menulist', label: '🍽️ Select New Menu' },
            { page: 'menu-report', label: '📋 Saved Menus' },
            { page: 'popular-menus', label: '📋 Favourite Menus'}
        ]},
        { name: 'services', icon: <FaConciergeBell className="text-green-400" />, title: 'Event Services', subItems: [
            { page: 'Select-Services', label: '🛍️ Select Services' },
            { page: 'view-Vendors', label: '👥 See Vendors' }
        ]},
        { name: 'tables', icon: <FaChair className="text-yellow-400" />, title: 'Arrange Tables', subItems: [
            { page: 'Select-Tables', label: '🎨 Select Designs' },
            { page: 'Reserve-Tables', label: '💺 Book Tables' },
            { page: 'see-arrangements', label: '👀 See Arrangements' }
        ]},
        { name: 'bar', icon: <FaCocktail className="text-pink-400" />, title: 'Bar Arrangements', subItems: [
            { page: 'Select-bar-Times', label: '⏰ Bar Times' },
            { page: 'setect-bites', label: '🍹 Bites ' },
            { page: 'select-bar-arrangements', label: '📋 Plan Bar' }
        ]}
    ];

    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-60 z-30 md:hidden ${isOpen ? 'block' : 'hidden'}`}
                onClick={() => setIsOpen(false)}
            ></div>
            <aside
                className={`bg-gray-800 text-white w-64 min-h-screen fixed top-0 left-0 z-40 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out shadow-lg`}
            >
                <div className="flex items-center justify-between p-4 bg-gray-900">
                    <span className="text-xl font-bold">Event Menu</span>
                    <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-300 hover:text-white">
                        <FaTimes size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
                    <button
                        onClick={() => {
                            setActivePage('dashboard');
                            closeSidebar();
                        }}
                        className="w-full flex items-center px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-all duration-200"
                    >
                        <FaChartPie className="mr-4 text-lg text-purple-400" />
                        <span className="font-medium">Dashboard</span>
                    </button>
                    <div className="border-t border-gray-700 my-2"></div>
                    
                    {/* Map through the data and pass the state down to each NavItem */}
                    {navItemsData.map(item => (
                        <NavItem
                            key={item.name}
                            name={item.name}
                            icon={item.icon}
                            subItems={item.subItems}
                            openMenu={openMenu}
                            setOpenMenu={setOpenMenu}
                            setActivePage={setActivePage}
                            closeSidebar={closeSidebar}
                        >
                            {item.title}
                        </NavItem>
                    ))}

                    <div className="border-t border-gray-700 my-2"></div>
                    <div className="px-4 py-3 text-gray-300 hover:bg-red-800/50 rounded-lg cursor-pointer">
                        <Logout />
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default EventHomeSideNav;