import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaCalendarCheck, FaClock, FaTasks } from 'react-icons/fa';

// Import your components
import EventHomeSideNav from './EventHomeSideNav';
import EventPlan from './CustomerEventPlanning';
import DisplayEvents from '../../pages/customers/DisplayEvents';
import EventServicesSelector from './EventServicesSelector';
import ServiceVendor from './ServiceVendor';
import TableReservation from './TableReservation';
import ChairArrangement from './ChairArrangement';
import ArrangementDetailsPage from './ArrangementDetailsPage';
import PlanBarForm from './PlanBarForm';
import PlanBiteForm from './PlanBiteForm';
import CustomerMenuListSelection from '../../components/CustomerMenuListSelection';
import MenuSummaryReport from './MenuSummaryReport';
import PopularMenuSelections from '../../components/PopularMenus';

import BarManagement from './BarManagement';
import EventNavbar from './EventNavbar'; // New component
import CustomerEventDashboard from './CustomerEventDashboard';

// A new, reusable card component for the dashboard
const DashboardCard = ({ title, value, icon, color }) => (
  <div className={`p-6 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300 ${color}`}>
    <div className="flex items-center">
      <div className="mr-4 text-white text-3xl">{icon}</div>
      <div>
        <p className="text-lg font-semibold text-white">{title}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </div>
    </div>
  </div>
);

const EventHome = () => {
  const { bookingId, customerID } = useParams();
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case 'plan-event':
        return <EventPlan bookingId={bookingId} />;
      case 'view-events':
        return <DisplayEvents customerID={customerID} />;
      case 'Select-Services':
        return <EventServicesSelector customerID={customerID} bookingId={bookingId} />;
      case 'view-Vendors':
        return <ServiceVendor customerID={customerID} bookingId={bookingId} />;
      case 'Select-Tables':
        return <ChairArrangement bookingId={bookingId} />;
      case 'Reserve-Tables':
        return <TableReservation bookingId={bookingId} />;
      case 'see-arrangements':
        return <ArrangementDetailsPage bookingId={bookingId} />;
      case 'Select-bar-Times':
        return <PlanBarForm bookingId={bookingId} />;
      case 'setect-bites':
        return <PlanBiteForm bookingId={bookingId} />;
      case 'select-bar-arrangements':
        return <BarManagement bookingId={bookingId} />;
      case 'plan-menulist':
        return <CustomerMenuListSelection />;
      case 'menu-report':
        return <MenuSummaryReport bookingId={bookingId} />;
      case 'popular-menus':
        return <PopularMenuSelections setActivePage={setActivePage} closeSidebar={closeSidebar} />;
      case 'dashboard':
      default:
        return <CustomerEventDashboard setActivePage={setActivePage} />
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar for Mobile */}
      <EventNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        {/* Sidebar */}
        <EventHomeSideNav
          setActivePage={setActivePage}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300">
          <div className="bg-white shadow-xl rounded-2xl p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EventHome;