import React, { useState, useEffect } from 'react';
import { 
  getAllStructuredMenuSelections,
  getStructuredSelectionsByBookingId,
  MenuSelectionService
} from '../../services/MenuService';
import { format } from 'date-fns';

const MenuCorrectionpage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentSelections, setCurrentSelections] = useState([]);
  const [menuOverview, setMenuOverview] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllStructuredMenuSelections();
        setCustomers(data);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenMenuEditor = async (booking) => {
    try {
      const selections = await getStructuredSelectionsByBookingId(booking.booking_id);
      // Flatten the selections structure for easier management
      const flattenedSelections = selections.menus.flatMap(menu => 
        menu.menu_types.flatMap(menuType => 
          menuType.categories.flatMap(category => 
            category.items.map(item => ({
              booking_id: booking.booking_id,
              menu_list_id: menu.menu_list_type_id,
              menu_list_name: menu.menu_list_name,
              menu_type_id: menuType.menu_type_id,
              menu_type_name: menuType.menu_type_name,
              category_id: category.category_id,
              category_name: category.category_name,
              item_id: item.item_id,
              item_name: item.item_name,
              ICMT_Id: item.ICMT_Id,
              price: item.price
            }))
          )
        )
      );
      
      setCurrentSelections(flattenedSelections);
      setSelectedBooking(booking);
    } catch (err) {
      console.error("Error fetching menu selections:", err);
      alert("Failed to load menu selections. Please try again.");
    }
  };

  const handleCloseMenuEditor = () => {
    setSelectedBooking(null);
    setCurrentSelections([]);
  };

  const handleSaveMenuSelections = async () => {
    if (!selectedBooking) return;
    
    try {
      // First delete all existing selections
      await MenuSelectionService.deleteAllMenuSelections(selectedBooking.booking_id);
      
      // Then add all new selections
      await Promise.all(
        currentSelections.map(selection => 
          MenuSelectionService.createMenuSelection(selection.booking_id, selection.ICMT_Id)
        )
      );
      
      setSuccessMessage("Menu selections updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Refresh the data
      const updatedData = await getAllStructuredMenuSelections();
      setCustomers(updatedData);
      handleCloseMenuEditor();
    } catch (err) {
      console.error("Error updating menu selections:", err);
      alert("Failed to update menu selections. Please try again.");
    }
  };

  const handleItemSelection = (ICMT_Id, isSelected) => {
    setCurrentSelections(prev => {
      if (isSelected) {
        // Find the item in the original selections
        const originalSelection = selectedBooking.menus
          .flatMap(menu => menu.menu_types
            .flatMap(menuType => menuType.categories
              .flatMap(category => category.items
                .find(item => item.ICMT_Id === ICMT_Id)
              )
            )
          ).find(item => item);
        
        if (!originalSelection) return prev;
        
        const menu = selectedBooking.menus.find(menu => 
          menu.menu_types.some(menuType => 
            menuType.categories.some(category => 
              category.items.some(item => item.ICMT_Id === ICMT_Id)
            )
          )
        );
        
        const menuType = selectedBooking.menus.flatMap(menu => menu.menu_types)
          .find(menuType => 
            menuType.categories.some(category => 
              category.items.some(item => item.ICMT_Id === ICMT_Id)
            )
          );
        
        const category = selectedBooking.menus.flatMap(menu => 
          menu.menu_types.flatMap(menuType => menuType.categories)
        ).find(category => 
          category.items.some(item => item.ICMT_Id === ICMT_Id)
        );
        
        return [
          ...prev,
          {
            booking_id: selectedBooking.booking_id,
            menu_list_id: menu?.menu_list_type_id,
            menu_list_name: menu?.menu_list_name,
            menu_type_id: menuType?.menu_type_id,
            menu_type_name: menuType?.menu_type_name,
            category_id: category?.category_id,
            category_name: category?.category_name,
            item_id: originalSelection.item_id,
            item_name: originalSelection.item_name,
            ICMT_Id: originalSelection.ICMT_Id,
            price: originalSelection.price
          }
        ];
      } else {
        // Remove the item from selections
        return prev.filter(sel => sel.ICMT_Id !== ICMT_Id);
      }
    });
  };

  const isItemSelected = (ICMT_Id) => {
    return currentSelections.some(sel => sel.ICMT_Id === ICMT_Id);
  };

  const getSelectedCountForCategory = (menuListId, menuTypeId, categoryId) => {
    return currentSelections.filter(sel => 
      sel.menu_list_id === menuListId && 
      sel.menu_type_id === menuTypeId && 
      sel.category_id === categoryId
    ).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-3 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {successMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {successMessage}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customer Menu Orders</h1>
          <p className="mt-2 text-gray-600">View and manage all customers menu selections</p>
        </div>

        {customers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-gray-500">There are currently no menu orders to display</p>
          </div>
        ) : (
          <div className="space-y-6">
            {customers.map((customers) => (
              <div key={customers.customer_id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-medium">
                        {customers.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-semibold text-gray-900">{customers.name}</h2>
                      <p className="text-sm text-gray-500">{customers.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {customers.bookings?.map((booking) => (
                    <div key={booking.booking_id} className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">
                            Booking #{booking.booking_id}
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {booking.status}
                            </span>
                            <span className="text-sm text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {booking.booking_date ? format(new Date(booking.booking_date), 'MMMM do, yyyy') : 'No date'}
                            </span>
                            <span className="text-sm text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                              {booking.number_of_guests} guests
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleOpenMenuEditor(booking)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Change Menu
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Menu Selection Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">
                    Edit Menu for Booking #{selectedBooking.booking_id}
                  </h2>
                  <button 
                    onClick={handleCloseMenuEditor}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Customer: {selectedBooking.customer_name || customers.find(c => c.bookings?.some(b => b.booking_id === selectedBooking.booking_id))?.name}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-8">
                  {selectedBooking.menus?.map((menu) => (
                    <div key={menu.menu_type_id} className="bg-gray-50 rounded-lg p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {menu.menu_list_name}
                      </h3>
                      
                      <div className="space-y-6">
                        {menu.menu_types?.map((menuType) => (
                          <div key={menuType.menu_type_id} className="pl-4 border-l-2 border-indigo-100">
                            <h4 className="text-md font-medium text-gray-800 mb-3">
                              {menuType.menu_type_name}
                              <span className="ml-2 text-sm font-normal text-indigo-600">
                                Rs. {menuType.price}
                              </span>
                            </h4>
                            
                            <div className="space-y-4">
                              {menuType.categories?.map((category) => (
                                <div key={category.category_id} className="pl-4 border-l-2 border-gray-200">
                                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                                    {category.category_name}
                                    <span className="ml-2 text-xs font-normal text-gray-500">
                                      (Select up to {category.item_limit} items)
                                    </span>
                                    <span className="ml-2 text-xs font-medium text-indigo-600">
                                      {getSelectedCountForCategory(menu.menu_list_type_id, menuType.menu_type_id, category.category_id)} selected
                                    </span>
                                  </h5>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {category.items?.map((item) => {
                                      const isSelected = isItemSelected(item.ICMT_Id);
                                      
                                      return (
                                        <div 
                                          key={item.ICMT_Id}
                                          onClick={() => handleItemSelection(item.ICMT_Id, !isSelected)}
                                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                            isSelected
                                              ? 'border-indigo-500 bg-indigo-50 transform scale-[1.02] shadow-md'
                                              : 'border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                                          }`}
                                        >
                                          <div className="flex justify-between items-start">
                                            <div>
                                              <div className="font-medium text-gray-800">{item.item_name}</div>
                                            </div>
                                            <div className="text-sm text-indigo-600 font-medium">
                                              Rs. {item.price}
                                            </div>
                                          </div>
                                          {isSelected && (
                                            <div className="mt-2 flex justify-end">
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                              </svg>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={handleCloseMenuEditor}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMenuSelections}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuCorrectionpage;