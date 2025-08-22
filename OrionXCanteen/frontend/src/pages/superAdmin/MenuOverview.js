import React, { useEffect, useState } from 'react';
import { getMenuOverview } from '../../services/MenuService';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';

const MenuOverview = () => {
  const [menuData, setMenuData] = useState([]);
  const [expandedList, setExpandedList] = useState(null);
  const [expandedType, setExpandedType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMenuOverview()
      .then(data => {
        setMenuData(data);
        setIsLoading(false);
      })
      .catch(console.error);
  }, []);

  const toggleList = id => setExpandedList(expandedList === id ? null : id);
  const toggleType = id => setExpandedType(expandedType === id ? null : id);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className="flex-grow overflow-y-auto border rounded-lg shadow-md bg-white p-4"
      style={{ maxHeight: '80vh' }}
    >
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Our Catering Menu</h1>
      

      {/* Hero section with catering image */}
      <div className="mb-8 rounded-lg overflow-hidden shadow-md">
        <div className="relative h-28 bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="relative z-10 text-center px-4">
            <h2 className="text-3xl font-bold text-white mb-2">Exquisite Catering Services</h2>
            <p className="text-blue-100">Perfect for weddings, corporate events, and special occasions</p>
          </div>
        </div>
      </div>

      {/* Menu lists */}
      <div className="space-y-6">
        {menuData.map(list => (
          <div key={list.id} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <button
              className={`w-full flex justify-between items-center px-6 py-4 ${expandedList === list.id ? 'bg-blue-600 text-white' : 'bg-white hover:bg-blue-50'} transition-colors duration-200`}
              onClick={() => toggleList(list.id)}
            >
              <span className="text-lg font-semibold">{list.name}</span>
              {expandedList === list.id ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
            
            {expandedList === list.id && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                {list.types.map(type => (
                  <div key={type.id} className="mb-4 last:mb-0 bg-white rounded-lg shadow-xs overflow-hidden">
                    <button
                      className={`w-full flex justify-between items-center px-4 py-3 ${expandedType === type.id ? 'bg-blue-50' : 'hover:bg-gray-50'} transition-colors duration-150`}
                      onClick={() => toggleType(type.id)}
                    >
                      <div>
                        <span className="font-medium text-gray-800">{type.name}</span>
                        <span className="ml-2 text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          LKR {type.price.toLocaleString()}
                        </span>
                      </div>
                      {expandedType === type.id ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedType === type.id && (
                      <div className="px-4 pb-3 pt-1 bg-white">
                        {type.categories.map(cat => (
                          <div key={cat.id} className="mt-3 pl-2 border-l-2 border-blue-200">
                            <h4 className="font-medium text-gray-700">
                              {cat.name} <span className="text-sm font-normal text-gray-500">(Choose {cat.limit})</span>
                            </h4>
                            <ul className="mt-2 space-y-1 ml-4">
                              {cat.items.map(item => (
                                <li key={item.id} className="text-gray-600 flex items-start">
                                  <span className="text-blue-500 mr-2">•</span>
                                  <span>{item.name}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Additional decorative elements */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Flexible Timing</h3>
            <p className="text-sm text-gray-500">Available for all events</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Quality Guarantee</h3>
            <p className="text-sm text-gray-500">Premium ingredients</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Custom Packages</h3>
            <p className="text-sm text-gray-500">Tailored to your needs</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default MenuOverview;