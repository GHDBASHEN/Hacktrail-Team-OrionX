import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';

// Import Side Navigation Components
import DefaultSAN from '../components/superAdminSideNavs/DefaultSAN';
import UserManagementSAN from '../components/superAdminSideNavs/UserManagementSAN';
import BookingManagementSAN from '../components/superAdminSideNavs/BookingManagementSAN';
import FoodManagementSAN from '../components/superAdminSideNavs/FoodManagementSAN'; // New Import

// Import Page Components
import OverView from './superAdmin/OverView';

const SuperAdminDB = () => {
    // Default topNav to 'F' to show Food Management first
    const [topNav, setTopNav] = useState('F'); 
    const [renderContent, setRenderContent] = useState(() => () => <OverView />);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isMobileTopNavOpen, setIsMobileTopNavOpen] = useState(false);
    const navigate = useNavigate();

    // Effect to close mobile menus on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileSidebarOpen(false);
                setIsMobileTopNavOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    // Main navigation items for the top bar
    const mainNavItems = [
        { id: 'D', label: 'Dashboard' },
        { id: 'F', label: 'Food Management' },
        { id: 'A', label: 'User Management' },
        { id: 'E', label: 'Bookings' }
    ];

    // Render the correct side navigation based on the topNav selection
    const renderNavs = () => {
        switch (topNav) {
            case 'F': return <FoodManagementSAN setRenderContent={setRenderContent} closeMobileMenu={() => setIsMobileSidebarOpen(false)} />;
            case 'A': return <UserManagementSAN setRenderContent={setRenderContent} closeMobileMenu={() => setIsMobileSidebarOpen(false)} />;
            case 'E': return <BookingManagementSAN setRenderContent={setRenderContent} closeMobileMenu={() => setIsMobileSidebarOpen(false)} />;
            default:  return <DefaultSAN setRenderContent={setRenderContent} closeMobileMenu={() => setIsMobileSidebarOpen(false)} />;
        }
    };

    return (
        <div className="flex flex-col md:flex-row bg-slate-100 min-h-[85vh]">
            {/* Mobile Top Bar */}
            <div className="md:hidden flex justify-between items-center p-4 bg-white border-b shadow-sm">
                <button onClick={() => setIsMobileSidebarOpen(true)} className="text-gray-600 focus:outline-none">
                    <HiMenu className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                <button onClick={() => setIsMobileTopNavOpen(true)} className="text-gray-600 focus:outline-none">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                </button>
            </div>

            {/* Mobile Navigation Overlays */}
            {isMobileSidebarOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsMobileSidebarOpen(false)}></div>
                    <div className="relative w-4/5 max-w-xs bg-white z-50 h-full overflow-y-auto">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Navigation</h2>
                            <button onClick={() => setIsMobileSidebarOpen(false)} className="text-gray-500 hover:text-gray-700"><HiX className="w-6 h-6" /></button>
                        </div>
                        {renderNavs()}
                    </div>
                </div>
            )}

            {isMobileTopNavOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                     <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsMobileTopNavOpen(false)}></div>
                     <div className="relative w-full bg-white z-50 mt-16 shadow-lg rounded-b-lg">
                         <ul className="py-2">
                             {mainNavItems.map((item) => (
                                 <li key={item.id}>
                                     <button
                                         type="button"
                                         onClick={() => {
                                             setTopNav(item.id);
                                             setIsMobileTopNavOpen(false);
                                             setIsMobileSidebarOpen(true); // Open sidebar after selection
                                         }}
                                         className="w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-100 font-medium"
                                     >
                                         {item.label}
                                     </button>
                                 </li>
                             ))}
                         </ul>
                     </div>
                </div>
            )}

            {/* Desktop Left Sidebar */}
            <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
                {renderNavs()}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Desktop Top Nav */}
                <div className="hidden md:flex items-center w-full p-2 bg-white border-b">
                    <ul className="flex items-center gap-2">
                        {mainNavItems.map((item) => (
                            <li key={item.id}>
                                <button 
                                    type="button" 
                                    onClick={() => setTopNav(item.id)}
                                    className={`font-semibold text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                                        topNav === item.id ? 'bg-blue-100 text-blue-700' : ''
                                    }`}
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                
                {/* Main Content */}
                <div className="flex-1 p-2 md:p-4 overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDB;
