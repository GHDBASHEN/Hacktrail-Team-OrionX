import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SuperAdminHome from './superAdmin/SuperAdminHome';
import UserManagementSAN from '../components/superAdminSideNavs/UserManagementSAN';
import EventManagementSAN from '../components/superAdminSideNavs/EventManagementSAN';
import MenuManagementSAN from '../components/superAdminSideNavs/MenuManagementSAN';
import DefaultSAN from '../components/superAdminSideNavs/DefaultSAN';
import PayrollManagementSAN from '../components/superAdminSideNavs/PayrollManagementSAN';
import BookingManagementSAN from '../components/superAdminSideNavs/BookingManagementSAN';
import CustomersManagementSAN from '../components/superAdminSideNavs/CustomersManagementSAN';
import { HiMenu, HiX } from 'react-icons/hi';
import OverView from './superAdmin/OverView';

const SuperAdminDB = () => {
  const [topNav, setTopNav] = useState();
  const [renderContent, setRenderContent] = useState(() => () => <OverView />);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileTopNavOpen, setIsMobileTopNavOpen] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Reset to default content (OverView) when topNav changes
  //   setRenderContent(() => () => <OverView />);
  // }, [topNav]);
  
  // Close mobile menus when screen resizes to desktop
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

  // Render the left side navigation bars
  const renderNavs = () => {
    switch (topNav) {
      case 'A': return <UserManagementSAN setRenderContent={setRenderContent} closeMobileMenu={() => setIsMobileSidebarOpen(false)} />;
      case 'C': return <EventManagementSAN setRenderContent={setRenderContent} closeMobileMenu={() => setIsMobileSidebarOpen(false)} />;
      case 'D': return <MenuManagementSAN setRenderContent={setRenderContent} closeMobileMenu={() => setIsMobileSidebarOpen(false)} />;
      case 'B': return <PayrollManagementSAN setRenderContent={setRenderContent} closeMobileMenu={() => setIsMobileSidebarOpen(false)} />;
      case 'E': return <BookingManagementSAN setRenderContent={setRenderContent} closeMobileMenu={() => setIsMobileSidebarOpen(false)} />;
      case 'F': return <CustomersManagementSAN setRenderContent={setRenderContent} closeMobileMenu={() => setIsMobileSidebarOpen(false)} />;
      default: return <DefaultSAN setRenderContent={setRenderContent} closeMobileMenu={() => setIsMobileSidebarOpen(false)} />;
    }
  };

  // Mobile navigation items
  const mobileNavItems = [
    { id: 'A', label: 'Employees' },
    { id: 'B', label: 'Payroll' },
    { id: 'C', label: 'Events' },
    { id: 'D', label: 'Menus' },
    { id: 'E', label: 'Bookings' },
    { id: 'F', label: 'Customers' },
  ];

  return (
    <div className="flex flex-col md:flex-row bg-slate-100 min-h-[85vh]">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white border-b">
        <button 
          onClick={() => setIsMobileSidebarOpen(true)}
          className="text-gray-500 focus:outline-none"
        >
          <HiMenu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button 
          onClick={() => setIsMobileTopNavOpen(true)}
          className="text-gray-500 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Overlays */}
      {/* Left Sidebar Mobile */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* <div 
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsMobileSidebarOpen(false)}
          ></div> */}
          <div className="relative w-4/5 max-w-xs bg-white z-50 h-full overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Navigation</h2>
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>
            {renderNavs()}
          </div>
        </div>
      )}

      {/* Top Nav Mobile */}
      {isMobileTopNavOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end md:hidden">
          <div 
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsMobileTopNavOpen(false)}
          ></div>
          <div className="relative w-full bg-white z-50 mt-16 shadow-lg">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Sections</h2>
              <button 
                onClick={() => setIsMobileTopNavOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>
            <ul className="py-2">
              {mobileNavItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setTopNav(item.id);
                      setIsMobileTopNavOpen(false);
                    }}
                    className="w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-100"
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
      <div className="hidden md:flex flex-col rounded-r-3xl overflow-hidden w-full md:w-1/5 lg:w-1/6 border-l border-gray-200 bg-white">
        {renderNavs()}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 border py-2 px-2 bg-slate-100">
        {/* Desktop Top Nav */}
        <div className="hidden md:flex justify-between items-center w-full border px-2 py-1 bg-white">
          <ul className="flex flex-wrap md:flex-nowrap gap-2 md:gap-8">
            {mobileNavItems.map((item) => (
              <li key={item.id}>
                <button 
                  type="button" 
                  onClick={() => setTopNav(item.id)}
                  className={`text-gray-700 text-base px-3 py-2 rounded-lg hover:bg-gray-50 ${
                    topNav === item.id ? 'bg-blue-100 text-blue-700' : ''
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Mobile Section Title */}
        {topNav && (
          <div className="md:hidden px-4 py-3 bg-white border-b">
            <h2 className="text-lg font-semibold">
              {mobileNavItems.find(item => item.id === topNav)?.label || 'Dashboard'}
            </h2>
          </div>
        )}

        {/* Main Content */}
        <div className="p-2 md:p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDB;
