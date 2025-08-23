import React, { useState } from 'react';
import { Logout } from '../../components/Logout';
import OverView from '../../pages/superAdmin/OverView';
import { HiOutlineViewGrid, HiOutlineCog, HiOutlineLogout } from 'react-icons/hi';
import FoodManagement from '../../pages/Admin/FoodManagement';
import CategoryManagement from '../../pages/Admin/CreateCategory';

const DefaultSAN = ({ setRenderContent, closeMobileMenu }) => {
  const [clickedItem, setClickedItem] = useState('overview');

  const handleRenderContent = (display) => {
    switch (display) {
      case 'overview':
        setClickedItem('overview');
        setRenderContent(() => () => <OverView />);
        break;
      case 'foodManagement':
        setClickedItem('foodManagement');
        setRenderContent(() => () => <FoodManagement />);
        break;
      case 'categoryManagement':
        setClickedItem('categoryManagement');
        setRenderContent(() => () => <CategoryManagement />);
        break;
      default:
        setRenderContent(() => () => <OverView />);
    }
    
    // Close mobile menu if it's open
    if (closeMobileMenu) closeMobileMenu();
  };

  return (
    <div className='w-full'>
      <ul className="flex flex-col py-4 space-y-2">
        <li>
          <button 
            onClick={() => handleRenderContent('overview')}
            className={`flex items-center w-full p-3 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 group ${
              clickedItem === 'overview' ? 'bg-gray-100' : ''
            }`}
          >
            <HiOutlineViewGrid className="w-6 h-6 text-gray-500 group-hover:text-gray-900" />
            <span className="ml-3">Overview</span>
          </button>
        </li>
        <li>
          <button 
            onClick={() => handleRenderContent('foodManagement')}
            className={`flex items-center w-full p-3 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 group ${
              clickedItem === 'setting' ? 'bg-gray-100' : ''
            }`}
          >
            <HiOutlineCog className="w-6 h-6 text-gray-500 group-hover:text-gray-900" />
            <span className="ml-3">Food Management</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => handleRenderContent('categoryManagement')}
            className={`flex items-center w-full p-3 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 group ${
              clickedItem === 'categoryManagement' ? 'bg-gray-100' : ''
            }`}
          >
            <HiOutlineCog className="w-6 h-6 text-gray-500 group-hover:text-gray-900" />
            <span className="ml-3">Category Management</span>
          </button>
        </li>
        <li>
          <button
            className="flex items-center w-full p-3 text-base font-normal text-red-600 rounded-lg hover:bg-red-100 group"
          >
            <HiOutlineLogout className="w-6 h-6 text-red-500 group-hover:text-red-700" />
            <span className="ml-3"><Logout /></span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DefaultSAN;