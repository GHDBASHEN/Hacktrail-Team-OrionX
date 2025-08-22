import React, { useEffect, useState } from 'react'
import { Logout } from '../../components/Logout'
import CalenderView from '../../pages/superAdmin/CalenderView';
import BookingView from '../../pages/superAdmin/BookingView';
import VenueView from '../../pages/superAdmin/VenueView';
import BookingHistoryView from '../../pages/superAdmin/BookingsAnalyze';
import InvoiceView from '../../pages/superAdmin/InvoiceView';
import BookingsView from '../../pages/superAdmin/BookingsAnalyze';
import BookingsAnalyze from '../../pages/superAdmin/BookingsAnalyze';
import Help from '../help/Help';
import HelpData from '../help/bookingHelpData.json';

const BookingManagementSAN = ({ setRenderContent }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [clickedItem, setClickedItem] = useState(null);
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    useEffect(() => {
        handleRenderContent('null')
    }, [])

    
    const handleRenderContent = (display) => {
        switch (display) {
            case 'calender-view':
                setClickedItem('calender-view');
                setRenderContent(() => () => <CalenderView />);
                break;
            case 'booking-view':
                setClickedItem('booking-view');
                setRenderContent(() => () => <BookingView />);
                break;
            case 'venue-view':
                setClickedItem('venue-view');
                setRenderContent(() => () => <VenueView />);
                break;
            case 'booking-analyze':
                setClickedItem('booking-analyze');
                setRenderContent(() => () => <BookingsAnalyze />);
                break;
            case 'invoice-view':
                setClickedItem('invoice-view');
                setRenderContent(() => () => <InvoiceView />);
                break;
            case 'help':
                setClickedItem('help');
                setRenderContent(() => () => <Help tz={HelpData} />);
                break;
            default:
                setClickedItem('calender-view');
                setRenderContent(() => () => <CalenderView />);
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
                        <a href="#" onClick={() => handleRenderContent('calender-view')} className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedItem === 'calender-view' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                            <svg className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z" />
                            </svg>
                            <span className="ml-3">Event Schedule Viewer</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => handleRenderContent('booking-view')} className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedItem === 'booking-view' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                            <svg className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>

                            <span className="ml-3">Create New Booking </span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => handleRenderContent('booking-analyze')} className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedItem === 'booking-analyze' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                            <svg className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13h2c1.1046 0 2 .8954 2 2s-.8954 2-2 2h-2.5M10 3c0 2.4-3 1.6-3 4m8-4c0 2.4-3 1.6-3 4m-7 4 .6398 6.398C5.84428 19.4428 7.56494 21 9.61995 21H10.38c2.0551 0 3.7757-1.5572 3.9802-3.602L15 11H5Z" />
                            </svg>
                            <span className="ml-3">Manage Bookings</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => handleRenderContent('venue-view')} className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedItem === 'venue-view' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                            <svg className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023" />
                            </svg>

                            <span className="ml-3">Manage Venues</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => handleRenderContent('invoice-view')} className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedItem === 'invoice-view' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                            <svg className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm2-2a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3Zm0 3a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2h-3Zm-6 4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-6Zm8 1v1h-2v-1h2Zm0 3h-2v1h2v-1Zm-4-3v1H9v-1h2Zm0 3H9v1h2v-1Z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-3">Invoice Management</span>
                        </a>
                    </li>

                    <li>
                        <a href="#" onClick={() => handleRenderContent('help')}  className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedItem === 'help-view' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
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

export default BookingManagementSAN