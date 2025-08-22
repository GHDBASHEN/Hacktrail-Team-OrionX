import React, { useEffect, useState } from "react";
import { getAllMenuViews, saveCustomerMenuSelection, checkBookingMenuSelection } from "../services/MenuService";
import { updateMenuFee } from "../services/BookngService";
import { Loader2, AlertCircle, ChevronDown, ChevronUp, Check, CheckCircle, XCircle, X } from "lucide-react";

const CustomerMenuTypeSelection = ({ menuListTypeId, onClose }) => {
  const [menuViews, setMenuViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMenuTypeId, setExpandedMenuTypeId] = useState(null);
  const [selections, setSelections] = useState({});
  const [menuPrice, setMenuPrice] = useState(null);
  const [hideSave, setHideSave] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchMenuViews = async () => {
      try {
        const data = await getAllMenuViews();
        const filtered = data.filter(
          (view) =>
            view.menu_list_type_id?.trim().toLowerCase() ===
            menuListTypeId?.trim().toLowerCase()
        );
        setMenuViews(filtered);
      } catch (err) {
        console.error(err);
        setError("Failed to load menu types. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuViews();
  }, [menuListTypeId]);

  useEffect(() => {
    const checkBooking = async () => {
      const bookingId = localStorage.getItem("bookingId");
      if (bookingId) {
        try {
          const exists = await checkBookingMenuSelection(bookingId);
          setHideSave(exists);
          if (exists) {
            showNotification("You've already made your menu selections!");
          }
        } catch (e) {
          console.error("Error checking booking:", e);
          setHideSave(false);
        }
      }
    };
    checkBooking();
  }, [menuListTypeId]);

  const handleSelect = (menuTypeId, categoryId, ICMT_Id, isSingleChoice) => {
    setSelections((prev) => {
      const prevMenu = prev[menuTypeId] || {};
      const prevCategory = prevMenu[categoryId] || [];

      let updatedCategory;
      if (isSingleChoice) {
        updatedCategory = [ICMT_Id];
      } else {
        if (prevCategory.includes(ICMT_Id)) {
          updatedCategory = prevCategory.filter((id) => id !== ICMT_Id);
        } else {
          const categoryLimit = (
            menuViews.find(
              (v) =>
                v.menu_type_id === menuTypeId &&
                v.category_id === categoryId
            )?.item_limit || 1
          );
          if (prevCategory.length < categoryLimit) {
            updatedCategory = [...prevCategory, ICMT_Id];
          } else {
            updatedCategory = prevCategory;
          }
        }
      }

      return {
        ...prev,
        [menuTypeId]: {
          ...prevMenu,
          [categoryId]: updatedCategory,
        },
      };
    });
  };

  const handleSaveSelections = async () => {
    setSaveLoading(true);
    setSaveError(null);

    try {
      if (!expandedMenuTypeId) {
        throw new Error("Please expand and select a menu type first.");
      }

      const menu = groupedMenu().find(m => m.menu_type_id === expandedMenuTypeId);
      if (!menu) {
        throw new Error("Invalid menu selection. Please try again.");
      }

      const selectedMenuSelections = selections[expandedMenuTypeId] || {};
      let allValid = true;
      let missingCategory = "";
      
      for (const category of Object.values(menu.categories)) {
        const selected = selectedMenuSelections[category.category_id] || [];
        if (selected.length !== category.item_limit) {
          allValid = false;
          missingCategory = category.category_name;
          break;
        }
      }
      
      if (!allValid) {
        throw new Error(`Please select ${missingCategory ? missingCategory : 'required'} items`);
      }

      const ICMT_Ids = [];
      Object.values(selectedMenuSelections).forEach((ids) => {
        ICMT_Ids.push(...ids);
      });

      const bookingId = localStorage.getItem("bookingId");
      if (!bookingId) {
        throw new Error("Booking session expired. Please start a new booking.");
      }

      await Promise.all(
        ICMT_Ids.map(ICMT_Id => 
          saveCustomerMenuSelection(bookingId, ICMT_Id)
        )
      );

      if (menuPrice) {
        await updateMenuFee(bookingId, { menueFee: menuPrice });
      }

      setHideSave(true);
      showNotification("Your menu selections have been saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      let errorMessage = "Failed to save selections.";
      
      if (error.response) {
        if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      setSaveError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  const groupedMenu = () => {
    const map = new Map();

    menuViews.forEach((item) => {
      if (!map.has(item.menu_type_id)) {
        map.set(item.menu_type_id, {
          menu_type_id: item.menu_type_id,
          menu_type_name: item.menu_type_name,
          price: item.price,
          categories: {},
        });
      }

      const menu = map.get(item.menu_type_id);

      if (!menu.categories[item.category_id]) {
        menu.categories[item.category_id] = {
          category_id: item.category_id,
          category_name: item.category_name,
          item_limit: item.item_limit,
          items: [],
        };
      }

      menu.categories[item.category_id].items.push({
        item_id: item.item_id,
        item_name: item.item_name,
        ICMT_Id: item.ICMT_Id,
      });
    });

    return Array.from(map.values());
  };

  const handleCloseDialog = () => {
    if (onClose) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-700">Loading menu options...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
          <button
            onClick={handleCloseDialog}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      {notification && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center ${
          notification.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <XCircle className="h-5 w-5 mr-2" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={handleCloseDialog}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Close menu selection"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>

        <div className="p-6">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
            Select Your Perfect Menu
          </h2>
          <p className="text-center text-blue-600 mb-6">
            Choose from our delicious options below
          </p>

          {groupedMenu().map((menu) => {
            const isOpen = expandedMenuTypeId === menu.menu_type_id;

            return (
              <div 
                key={menu.menu_type_id} 
                className={`border rounded-lg mb-4 shadow-md transition-all duration-300 ${isOpen ? 'border-blue-300 bg-white' : 'border-gray-200 bg-white hover:bg-blue-50'}`}
              >
                <button
                  onClick={() => {
                    setExpandedMenuTypeId(isOpen ? null : menu.menu_type_id);
                    setMenuPrice(menu.price);
                  }}
                  className={`w-full flex justify-between items-center px-6 py-4 text-left transition-colors ${isOpen ? 'bg-blue-600 text-white' : 'bg-white text-blue-900 hover:bg-blue-100'}`}
                >
                  <div>
                    <h3 className="text-xl font-bold">{menu.menu_type_name}</h3>
                    <p className={`${isOpen ? 'text-blue-100' : 'text-blue-600'} mt-1`}>
                      Rs. {menu.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {isOpen ? (
                      <ChevronUp className="h-6 w-6" />
                    ) : (
                      <ChevronDown className="h-6 w-6" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 py-4 space-y-6 animate-fadeIn">
                    {Object.values(menu.categories).map((category) => {
                      const isSingleChoice = category.item_limit === 1;
                      const selectedItems = selections[menu.menu_type_id]?.[category.category_id] || [];

                      return (
                        <div
                          key={category.category_id}
                          className="bg-blue-50 p-5 rounded-lg shadow-sm border border-blue-100"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold text-blue-800">
                              {category.category_name}
                            </h3>
                            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Choose {category.item_limit}
                            </span>
                          </div>

                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {category.items.map((item) => (
                              <li
                                key={item.item_id}
                                className={`p-3 rounded-lg transition-all cursor-pointer ${
                                  selectedItems.includes(item.ICMT_Id)
                                    ? 'bg-blue-100 border-2 border-blue-400'
                                    : 'bg-white hover:bg-blue-50 border border-gray-200'
                                }`}
                                onClick={() =>
                                  handleSelect(
                                    menu.menu_type_id,
                                    category.category_id,
                                    item.ICMT_Id,
                                    isSingleChoice
                                  )
                                }
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`flex-shrink-0 h-5 w-5 rounded flex items-center justify-center ${
                                    selectedItems.includes(item.ICMT_Id)
                                      ? 'bg-blue-600 text-white'
                                      : 'border border-gray-300 bg-white'
                                  }`}>
                                    {selectedItems.includes(item.ICMT_Id) && (
                                      <Check className="h-3 w-3" />
                                    )}
                                  </div>
                                  <label className="cursor-pointer text-gray-800 font-medium">
                                    {item.item_name}
                                  </label>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {!hideSave && (
          <div className="sticky bottom-0 bg-white py-4 shadow-lg border-t border-gray-200">
            <div className="px-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {saveError && (
                  <div className="text-red-600 flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full">
                    <XCircle size={18} /> 
                    <span className="text-sm">{saveError}</span>
                  </div>
                )}
                <button
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white shadow-lg transition ${
                    saveLoading 
                      ? 'bg-blue-400' 
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl'
                  }`}
                  onClick={handleSaveSelections}
                  disabled={saveLoading}
                >
                  {saveLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <span>Confirm Your Selections</span>
                    </> 
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerMenuTypeSelection;