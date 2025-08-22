import React, { useEffect, useState } from 'react';
import superAdminHome from '../../pages/superAdmin/SuperAdminHome';
import AddEmployee from '../../pages/superAdmin/AddEmployee';
//import GetEmployees from '../../pages/superAdmin/GetEmployee';
import UpdateEmployees from '../../pages/superAdmin/UpdateEmployees';
import Help from '../help/Help';
import EmpHelpData from '../help/empHelpData.json'
import { Logout } from '../../components/Logout'


// Set display according to user management butttons
const UserManagementSAN = ({ setRenderContent }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clickedItem, setClickedItem] = useState(null);
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);


  useEffect(() => {
    handleRenderContent('null')
  }, [])

  const handleRenderContent = (display) => {
    switch (display) {
      case 'addEmployees':
        setClickedItem('addEmployees');
        setRenderContent(() => () => <AddEmployee />);
        break;
      case 'updateEmployeesById':
        setClickedItem('updateEmployeesById');
        setRenderContent(() => () => <UpdateEmployees />);
        break;
      case 'help':
        setClickedItem('help');
        setRenderContent(() => () => <Help tz={EmpHelpData} />);
        break;
      default:
        setClickedItem('updateEmployeesById');
        setRenderContent(() => () => <UpdateEmployees />);
    }
  };

  //Display buttons in left side nav for user management
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
            <a href="#" onClick={() => handleRenderContent('addEmployees')} className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedItem === 'addEmployees' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
              <svg className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z" clipRule="evenodd" />
              </svg>
              <span className="ml-3">Add Employee</span>
            </a>
          </li>

          <li>
            <a href="#" onClick={() => handleRenderContent('updateEmployeesById')} className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${clickedItem === 'updateEmployeesById' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
              <svg className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clipRule="evenodd" />
              </svg>

              <span className="ml-3">Manage Employees</span>
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

export default UserManagementSAN