import React, { useEffect, useState } from 'react'
import { Logout } from '../../components/Logout'
import EventAssignment from '../events/EventAssignment'
import SeeEvents from '../events/SeeEvents'
import EventServiceList from '../events/EventServiceList'
import VendorList from '../events/VendorList'
import CustomerEventServiceList from '../events/CustomerEventServiceList'
import AdminTableChairArrangement from '../events/AdminTableChairArrangement'
import AdminBarManagementPage from '../events/AdminBarManagementPage'
import Help from '../help/Help'

import EventHelpData from '../help/eventHelpData.json'
import AdminReports from '../events/AdminReports'


const EventManagementSAN = ({ setRenderContent }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clickedItem, setClickedItem] = useState(null);
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  useEffect(() => {
    handleRenderContent('null')
  }, [])
  const handleRenderContent = (display) => {
    switch (display) {
      case 'assignEmployees':
        setClickedItem('assignEmployees');
        setRenderContent(() => () => <EventAssignment />);
        break;
      case 'eventDetails':
        setClickedItem('eventDetails');
        setRenderContent(() => () => <SeeEvents />);
        break;
      case 'eventServices':
        setClickedItem('eventServices');
        setRenderContent(() => () => <EventServiceList />);
        break;
      case 'eventVendors':
        setClickedItem('eventVendors');
        setRenderContent(() => () => <VendorList />);
        break;
      case 'customerEventServices':
        setClickedItem('customerEventServices');
        setRenderContent(() => () => <CustomerEventServiceList />);
        break;
      case 'TableChairArrangement':
        setClickedItem('TableChairArrangement');
        setRenderContent(() => () => <AdminTableChairArrangement />);
        break;
      case 'AdminBarPlan':
        setClickedItem('AdminBarPlan');
        setRenderContent(() => () => <AdminBarManagementPage />);
        break;
      case 'help':
        setClickedItem('help');
        setRenderContent(() => () => <Help tz={EventHelpData}/>);
        break;
      case 'Reports':
        setClickedItem('Reports');
        setRenderContent(() => () => <AdminReports />);
        break;
      default:
        setRenderContent(() => () => <EventAssignment />);
        setClickedItem('assignEmployees');
    }
  };
  return (
    <div className=''>
      <ul className="flex flex-col py-4 ">
        <button type="button" className="fixed top-4 left-4 z-50 p-2 text-gray-500 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-gray-400 sm:hidden" onClick={toggleSidebar}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2z" clipRule="evenodd"></path>
          </svg>
        </button>
        <ul className="space-y-2">
          <li>
            <a href="#" onClick={() => handleRenderContent('assignEmployees')} className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedItem === 'assignEmployees' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
              <svg className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2V19.2c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>

              <span className="ml-3">Event Employees</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => handleRenderContent('eventDetails')} className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedItem === 'eventDetails' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
              <svg className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V9l-6-6H5zm7 3v5h5v-1h-4V6h-1z" />
              </svg>

              <span className="ml-3">Event Details</span>
            </a>
          </li>

          <li>
            <a href="#" onClick={() => handleRenderContent('eventServices')} className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedItem === 'eventServices' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
              <svg className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h16v2H4v-2zm0 4h10v2H4v-2z" />
              </svg>

              <span className="ml-3">Event Services</span>
            </a>
          </li>

          <li>
            <a href="#" onClick={() => handleRenderContent('eventVendors')} className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedItem === 'eventVendors' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
              <svg className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 6l9 6 9-6v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6z" />
              </svg>

              <span className="ml-3">Event Vendors</span>
            </a>
          </li>

          <li>
            <a href="#" onClick={() => handleRenderContent('customerEventServices')} className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedItem === 'customerEventServices' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
              <svg className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 12c-4.4 0-8 2.2-8 5v3h16v-3c0-2.8-3.6-5-8-5z" />
              </svg>

              <span className="ml-3">Customer Event Services</span>
            </a>
          </li>

          <li>
            <a href="#" onClick={() => handleRenderContent('TableChairArrangement')} className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedItem === 'TableChairArrangement' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
              <svg className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 3h16v2H4V3zm2 4h12v14H6V7zm2 2v10h8V9H8z" />
              </svg>

              <span className="ml-3">Table Chair Arrangement</span>
            </a>
          </li>

          <li>
            <a href="#" onClick={() => handleRenderContent('AdminBarPlan')} className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedItem === 'AdminBarPlan' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
              <svg className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 2h10l-1 5h2v2H6V7h2L7 2zm2.5 14h5v6h-5v-6z" />
              </svg>

              <span className="ml-3">Bar Management</span>
            </a>
          </li>

          <li>
            
            <a href="#" onClick={() => handleRenderContent('Reports')} className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedItem === 'AdminBarPlan' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
              <svg className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white"
                fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 2a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM8 14h8v2H8v-2zm0 4h5v2H8v-2z" />
              </svg>


              <span className="ml-3">Reports</span>
            </a>
          </li>

          <li>
            <a href="#" onClick={() => handleRenderContent('help')} className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 2a8 8 0 108 8 8 8 0 00-8-8zm1 12H9v-2h2zm0-4H9V6h2z" clipRule="evenodd"></path>
              </svg>
              <span className="ml-3">Help</span>
            </a>
          </li>
          <li>
            <button
              className="flex items-center p-2 text-base font-normal text-red-600 rounded-lg hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-800 group w-full">
              <svg
                className="flex-shrink-0 w-6 h-6 text-red-500 transition duration-75 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h6a1 1 0 110 2H5v10h5a1 1 0 110 2H4a1 1 0 01-1-1V4zm13.707 5.293a1 1 0 00-1.414-1.414L13 10.172l-1.293-1.293a1 1 0 10-1.414 1.414L11.586 12l-1.293 1.293a1 1 0 101.414 1.414L13 13.828l1.293 1.293a1 1 0 001.414-1.414L14.414 12l1.293-1.293z"
                  clipRule="evenodd"></path>
              </svg>
              <span className="ml-3"><Logout /></span>
            </button>
          </li>
        </ul>
      </ul>
    </div>
  )
}

export default EventManagementSAN