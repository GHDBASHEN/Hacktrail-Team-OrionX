import React from 'react';
import { FaUtensils, FaPlus, FaCalendarDay, FaBoxOpen } from 'react-icons/fa';
import CategoryManagement from '../../pages/Admin/CreateCategory';
import FoodManagement from '../../pages/Admin/FoodManagement';
import DailyFoodManagement from '../../pages/Admin/DailyFoodManagement';
import DailyFoodComponentManagement from '../../pages/Admin/DailyFoodComponentManagement';

const FoodManagementSAN = ({ setRenderContent, closeMobileMenu }) => {
    const navItems = [
        {
            label: 'Categories',
            icon: <FaBoxOpen className="mr-3" />,
            component: () => <CategoryManagement />,
        },
        {
            label: 'Food Items',
            icon: <FaUtensils className="mr-3" />,
            component: () => <FoodManagement />,
        },
        {
            label: 'Daily Foods',
            icon: <FaCalendarDay className="mr-3" />,
            component: () => <DailyFoodManagement />,
        },
        {
            label: 'Food Components',
            icon: <FaPlus className="mr-3" />,
            component: () => <DailyFoodComponentManagement />,
        },
    ];

    const handleNavigation = (component) => {
        setRenderContent(() => component);
        if (closeMobileMenu) {
            closeMobileMenu();
        }
    };

    return (
        <div className="w-full bg-white">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Food & Menu</h2>
            </div>
            <ul className="flex flex-col py-2">
                {navItems.map((item, index) => (
                    <li key={index}>
                        <button
                            type="button"
                            onClick={() => handleNavigation(item.component)}
                            className="w-full flex items-center text-left px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FoodManagementSAN;
