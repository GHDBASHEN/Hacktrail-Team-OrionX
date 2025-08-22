import React, { useEffect, useState } from 'react'
import { Logout } from '../../components/Logout'
import CreateMenuListType from '../../pages/superAdmin/CreateMenuListType';
import CreateMenuType from '../../pages/superAdmin/CreateMenuType';
import CreateCategory from '../../pages/superAdmin/CreateCategories';
import CreateItem from '../../pages/superAdmin/CreateItem';
import CreateCategoryMenuType from '../../pages/superAdmin/CreateCategoryMenuType';
import MenuOverview from '../../pages/superAdmin/MenuOverview';
import CreateItemCategoryMenuType from '../../pages/superAdmin/CreateItemCategoryMenuType';
// import CustomerMenuSummaryReport from '../../pages/superAdmin/CustomerMenuSummary'; 
import AdminCorrectMenuSelections from '../../pages/superAdmin/AdminCorrectMenuSelections';
import AdminMenuOrdersPage from '../../pages/superAdmin/AdminViewMenuOrders';
import Help from '../help/Help';
import MenuHelpData from '../help/menuHelpData.json'

const MenuManagementSAN = ({ setRenderContent }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPagesDropdownOpen, setIsPagesDropdownOpen] = useState(false);
  const [isSalesDropdownOpen, setIsSalesDropdownOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [clickedItem, setClickedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('MenuOverview'); // Track active tab

  
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const toggleDropdown = dropdown => {
    if (dropdown === 'pages') setIsPagesDropdownOpen(prev => !prev);
    else if (dropdown === 'sales') setIsSalesDropdownOpen(prev => !prev);
    else if (dropdown === 'tools') setIsToolsDropdownOpen(prev => !prev);
  };

  const [selected, setSelected] = useState('');

  useEffect(() => {
    handleRenderContent('MenuOverview')
  }, [])

  const handleRenderContent = (display) => {
    setSelected(display);
    setActiveTab(display); // Set the active tab when clicked
    switch (display) {
      case 'createMenuListTypes':
        setClickedItem('createMenuListTypes');
       setRenderContent(() => () => <CreateMenuListType setRenderContent={setRenderContent} handleRenderContent={handleRenderContent} />);
        break;
      case 'createMenuTypes':
        setClickedItem('createMenuTypes');
         setRenderContent(() => () => <CreateMenuType setRenderContent={setRenderContent} handleRenderContent={handleRenderContent} />);
        break;
      case 'createCategory':
        setClickedItem('createCategory');
        setRenderContent(() => () => <CreateCategory setRenderContent={setRenderContent} handleRenderContent={handleRenderContent} />);
        break;
      case 'createItem':
        setClickedItem('createItem');
        setRenderContent(() => () => <CreateItem setRenderContent={setRenderContent} handleRenderContent={handleRenderContent} />);
        break;
      case 'createCategoryMenuType':
        setClickedItem('createCategoryMenuType');
        setRenderContent(() => () => <CreateCategoryMenuType setRenderContent={setRenderContent} handleRenderContent={handleRenderContent} />);
        break;
      case 'MenuOverview':
        setRenderContent(() => () => <MenuOverview />);
        break;
      case 'createItemCategoryMenuType':
        setClickedItem('createItemCategoryMenuType');
        setRenderContent(() => () => <CreateItemCategoryMenuType setRenderContent={setRenderContent} handleRenderContent={handleRenderContent} />);
        break;
      case 'AdminCorrectMenuSelections' :
        setRenderContent(() => () => <AdminCorrectMenuSelections />);
        break;
      case 'AdminMenuOrdersPage':
        setRenderContent(() => () => <AdminMenuOrdersPage />);
        break;
      case 'help':
        setRenderContent(() => () => <Help tz={MenuHelpData} />);
        break;
      default:
        setRenderContent(() => () => <MenuOverview/>);
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
            <a href="#" onClick={() => handleRenderContent('MenuOverview')} className={`flex items-center p-2 text-base font-normal rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${activeTab === 'MenuOverview' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900'} ${clickedItem === 'booking-view' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
              <svg aria-hidden="true" className={`w-6 h-6 transition duration-75 ${activeTab === 'MenuOverview' ? 'text-blue-600 dark:text-blue-300' : 'text-gray-400 dark:text-gray-400'} group-hover:text-gray-900 dark:group-hover:text-white`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
              </svg>
              <span className="ml-3">Overview Menues</span>
            </a>
          </li>

          {/* Pages Dropdown */}
          <li>
            <button type="button" className={`flex items-center p-2 w-full text-base font-normal rounded-lg transition duration-75 group hover:bg-gray-100 dark:hover:bg-gray-700 ${activeTab.startsWith('create') ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`} onClick={() => toggleDropdown('pages')}>
              <svg className={`w-6 h-6 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white ${activeTab.startsWith('create') ? 'text-blue-600 dark:text-blue-300' : 'text-gray-400 dark:text-gray-400'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 5v14m14 0V8h2M3 8h6m0-2v8.5858c0 .8909 1.0771 1.3371 1.7071.7071l.5858-.5858c.3905-.3905 1.0237-.3905 1.4142 0l.5858.5858c.3905.3905 1.0237.3905 1.4142 0l.5858-.5858c.3905-.3905 1.0237-.3905 1.4142 0l.5858.5858c.63.63 1.7071.1838 1.7071-.7071V6c0-.55228-.4477-1-1-1h-8c-.55229 0-1 .44772-1 1Z" />
              </svg>
              <span className="flex-1 ml-3 text-left whitespace-nowrap">Menu Management</span>
              <svg aria-hidden="true" className={`w-6 h-6 transition-transform ${isPagesDropdownOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
            <ul className={`${isPagesDropdownOpen ? '' : 'hidden'} py-2 space-y-2`}>
              <li><a href="#" onClick={() => handleRenderContent('createMenuListTypes')}  className={`flex items-center p-2 pl-11 w-full text-base font-normal rounded-lg transition duration-75 group hover:bg-gray-100 dark:hover:bg-gray-700 ${activeTab === 'createMenuListTypes' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'} `}>Menu List Setup</a></li>
              <li><a href="#" onClick={() => handleRenderContent('createMenuTypes')} className={`flex items-center p-2 pl-11 w-full text-base font-normal rounded-lg transition duration-75 group hover:bg-gray-100 dark:hover:bg-gray-700 ${activeTab === 'createMenuTypes' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>Define Menu Types</a></li>
              <li><a href="#" onClick={() => handleRenderContent('createCategory')} className={`flex items-center p-2 pl-11 w-full text-base font-normal rounded-lg transition duration-75 group hover:bg-gray-100 dark:hover:bg-gray-700 ${activeTab === 'createCategory' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>Manage Food categories</a></li>
              <li><a href="#" onClick={() => handleRenderContent('createItem')} className={`flex items-center p-2 pl-11 w-full text-base font-normal rounded-lg transition duration-75 group hover:bg-gray-100 dark:hover:bg-gray-700 ${activeTab === 'createItem' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>Add Food Items</a></li>
              <li><a href="#" onClick={() => handleRenderContent('createCategoryMenuType')} className={`flex items-center p-2 pl-11 w-full text-base font-normal rounded-lg transition duration-75 group hover:bg-gray-100 dark:hover:bg-gray-700 ${activeTab === 'createCategoryMenuType' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>Link Categories to Menu Types</a></li>
              <li><a href="#" onClick={() => handleRenderContent('createItemCategoryMenuType')} className={`flex items-center p-2 pl-11 w-full text-base font-normal rounded-lg transition duration-75 group hover:bg-gray-100 dark:hover:bg-gray-700 ${activeTab === 'createItemCategoryMenuType' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>Map Items with Categories & Menu Types</a></li>
            </ul>
          </li>

          {/* Sales Dropdown */}
          <li>
            <button type="button" className={`flex items-center p-2 w-full text-base font-normal rounded-lg transition duration-75 group hover:bg-gray-100 dark:hover:bg-gray-700 ${activeTab === 'CustomerMenuSummary' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`} onClick={() => toggleDropdown('sales')}>
              <svg aria-hidden="true" className={`flex-shrink-0 w-6 h-6 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white ${activeTab === 'CustomerMenuSummary' ? 'text-blue-600 dark:text-blue-300' : 'text-gray-400 dark:text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path>
              </svg>
              <span className="flex-1 ml-3 text-left whitespace-nowrap">Catering Operations</span>
              <svg aria-hidden="true" className={`w-6 h-6 transition-transform ${isSalesDropdownOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
            <ul className={`${isSalesDropdownOpen ? '' : 'hidden'} py-2 space-y-2`}>
              <li><a href="#" onClick={() => handleRenderContent('AdminMenuOrdersPage')} className={`flex items-center p-2 pl-11 w-full text-base font-normal rounded-lg transition duration-75 group hover:bg-gray-100 dark:hover:bg-gray-700 ${activeTab === 'CustomerMenuSummary' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>View Catering Orders</a></li>
              <li><a href="#" onClick={() => handleRenderContent('AdminCorrectMenuSelections')}  className="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Delete Catering Orders</a></li>
              
            </ul>
          </li>

          <li>
            <a href="#" onClick={() => handleRenderContent('help')}  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
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
  );
}


export default MenuManagementSAN;