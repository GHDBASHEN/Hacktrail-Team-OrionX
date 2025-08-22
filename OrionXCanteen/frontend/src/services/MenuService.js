import api from './Api';

//to display all menulisttypes and add new menulisttypes through form
export const getMenus = async () => {
  try {
    const response = await api.get('/menuListType/getAll');
    return response.data;
  } catch (error) {
    console.error("Error fetching menus:", error);
    throw error;
  }
};

//get menu list type by id
export const getMenuListTypeById = async (id) => {
  try {
    const response = await api.get(`/menuListType/get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting menu list type:", error);
    throw error;
  }
}; 

//add new menu list type
export const addMenuListType = async (menu) => {
  try {
    const response = await api.post('/menuListType/add', menu);
    return response.data;
  } catch (error) {
    console.error("Error adding menu list type:", error);
    throw error;
  }
};  

//delete new menu list type by id
export const deleteMenuListType = async (id) => {
  try {
    const response = await api.delete(`/menuListType/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting menu list type:", error);
    throw error;
  }
}; 

// update menu list type by id
export const updateMenuListTypeById = async (id, data) => {
  const name = {menu_list_name:data}
  try {
    const response = await api.put(`/menuListType/update/${id}`, name);
    return response.data;
  } catch (error) {
    console.error("Error updating menu list type:", error);
    throw error;
  }
}; 
////////////////////////////////////////////////////////////////////////////////////////////////////////////



//to display all menytypes and add new menu types through form
export const getMenuTypes = async () => {
  try {
    const response = await api.get('/menutypes/getAll');
    return response.data;
  } catch (error) {
    console.error("Error fetching menu types:", error);
    throw error;
  }
};

//to get one menutype by id
export const getMenuTypeById = async (id) => {
  try {
    const response = await api.get(`/menutypes/get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error adding menutype:", error);
    throw error;
  }
}; 

//to insert a menutype 
export const addMenuType = async (menuType) => {
  try {
    const response = await api.post('/menutypes/add', menuType);
    return response.data;
  } catch (error) {
    console.error("Error adding menu type:", error);
    throw error;
  }
};

//delete menu type by id
export const deleteMenuType = async (id) => {
  try {
    const response = await api.delete(`/menutypes/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting menu type:", error);
    throw error;
  }
}

// update menu type by id
export const updateMenuTypeById = async (data) => {
  try {
    const response = await api.put(`/menutypes/update/${data.menu_type_id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating menu type:", error);
    throw error;
  }
};

//////////////////////////////////////////////////////////////////////////////////

//to display all categories and add new categories through form
export const getCategories = async () => {
  try {
    const response = await api.get('/categories/getAll');
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};


//to insert a category
export const addCategory = async (category) => {
  try {
    const response = await api.post('/categories/add', category);
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

//to display a category by id
export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/categories/get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting category:", error);
    throw error;
  }
}; 

//to delete a category 
export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}; 

//to update a category
export const updateCategoryById = async (id, data) => {
  const name = {category_name:data}
  try {
    const response = await api.put(`/categories/update/${id}`, name);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}; 

//////////////////////////////////////////////////////////////////////

//to display all items and add new items through form
export const getItems = async () => {
  try {
    const response = await api.get('/items/getAll');
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

//to insert an item
export const addItem = async (item) => {
  try {
    const response = await api.post('/items/add', item);
    return response.data;
  } catch (error) {
    console.error("Error adding item:", error);
    throw error;
  }
};

//to diplay an item by id
export const getItemById = async (id) => {
  try {
    const response = await api.get(`/items/get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting item:", error);
    throw error;
  }
}; 


//to delete an item 
export const deleteItem = async (id) => {
  try {
    const response = await api.delete(`/items/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
}; 

//to update an item
export const updateItem = async (id, data) => {
  const name = { item_name: data }; 
  try {
    const response = await api.put(`/items/update/${id}`, name);
    return response.data;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};



//////////////////////////////////////////////////////////////////////////////////

// to display all category menu types and add new category menu types through form
export const getCategoryMenuTypes = async () => {
  try {
    const response = await api.get('/categoryMenuTypes/getAll');
    return response.data;
  } catch (error) {
    console.error("Error fetching category menu types:", error);
    throw error;
  }
};


//to insert a category menu type
export const addCategoryMenuType = async (categoryMenu) => {
  try {
    const response = await api.post('/categoryMenuTypes/add', categoryMenu);
    return response.data;
  } catch (error) {
    console.error("Error adding category menu type:", error);
    throw error;
  }
};

export const getCustomerMenuSelections =  async (booking_id) => {
  try {
    const response = await api.get(`/customerMenuSelection/getCustomerMenuSelections/${booking_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customers menu selections:", error);
    throw error;
  }
};

//to display a category menu type by id
export const getCategoryMenuTypeById = async (id) => {
  try {
    const response = await api.get(`/categoryMenuTypes/get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting category menu type:", error);
    throw error;
  }
}; 

//to delete a category menu type
export const deleteCategoryMenuType = async (id) => {
  try {
    const response = await api.delete(`/categoryMenuTypes/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category menu type:", error);
    throw error;
  }
}; 

//to update a catedory menu type by id
export const updateCategoryMenuType = async (id, data) => {
  const name = {categoryMenuType_name:data}
  try {
    const response = await api.put(`/categoryMenuTypes/update/${id}`, name);
    return response.data;
  } catch (error) {
    console.error("Error updating category menu type:", error);
    throw error;
  }
}; 

////////////////////////////////////////////////////////////////////////////////


// to display all item category menu types 
export const getItemCategoryMenuTypes = async () => {
  try {
    const response = await api.get('/ItemCategoryMenuType/');
    return response.data;
  } catch (error) {
    console.error("Error fetching item category menu types:", error);
    throw error;
  }
}

//to insert an item category menu type
export const addItemCategoryMenuType = async (itemCategoryMenu) => {
  try {
    const response = await api.post('/ItemCategoryMenuType/', itemCategoryMenu);
    return response.data;
  } catch (error) {
    console.error("Error adding item category menu type:", error);
    throw error;
  }
};

//to get item category menu type by id
export const getItemCategoryMenuTypeById = async (id) => {
  try {
    const response = await api.get(`/ItemCategoryMenuType/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting item category menu type:", error);
    throw error;
  }
};

//to delete item category menu type by id
export const deleteItemCategoryMenuType = async (id) => {
  try {
    const response = await api.delete(`/ItemCategoryMenuType/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting item category menu type:", error);
    throw error;
  }
};

//to update item category menu type by id
export const updateItemCategoryMenuTypeById = async (id, data) => {
  try {
    const response = await api.put(`/ItemCategoryMenuType/${id}`, {category_menu_type_id: data.category_menu_type_id, item_id: data.item_id});
    return response.data;
  } catch (error) {
    console.error("Error updating item category menu type:", error);
    throw error;
  }
};



// // Get all menu types under a specific menu list type
// export const getMenusByListType = async (listTypeId) => {
//   try {
//     const response = await api.get(`/menutypes/getByMenuListType/${listTypeId}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching menu types by list type:", error);
//     throw error;
//   }
// };


////////////////////////// advance view
export const getMenuOverview = async () => {
  const response = await api.get('/advanceMenu/overview');
  return response.data.data; // nested menu array
};
////////////////////////////////////////////////////////////////////////////

//to display all menulisttypes and add new menulisttypes through form
export const CusgetMenuListType = async () => {
  try {
    const response = await api.get('/menuListType/getAll');
    return response.data;
  } catch (error) {
    console.error("Error fetching menus:", error);
    throw error;
  }
};

//get menu list type by id
export const CusgetMenuListTypeById = async (id) => {
  try {
    const response = await api.get(`/menuListType/get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting menu list type:", error);
    throw error;
  }
}; 

//to display all menytypes and add new menu types through form
export const CusgetMenuTypes = async () => {
  try {
    const response = await api.get('/menutypes/getAll');
    return response.data;
  } catch (error) {
    console.error("Error fetching menu types:", error);
    throw error;
  }
};


//to display all categories and add new categories through form
export const CusgetCategories = async () => {
  try {
    const response = await api.get('/categories/getAll');
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

//to display all items and add new items through form
export const CusgetItems = async () => {
  try {
    const response = await api.get('/items/getAll');
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};


// to display all category menu types and add new category menu types through form
export const CusgetCategoryMenuTypes = async () => {
  try {
    const response = await api.get('/categoryMenuTypes/getAll');
    return response.data;
  } catch (error) {
    console.error("Error fetching category menu types:", error);
    throw error;
  }
};

// to display all item category menu types 
export const CusgetItemCategoryMenuTypes = async () => {
  try {
    const response = await api.get('/ItemCategoryMenuType/getAll');
    return response.data;
  } catch (error) {
    console.error("Error fetching item category menu types:", error);
    throw error;
  }
}

// To display all menu views
export const getAllMenuViews = async () => {
  try {
    const response = await api.get('/advanceMenuView/getAll');
    return response.data;
  } catch (error) {
    console.error("Error fetching menu views:", error);
    throw error;
  }
};

// Get a menu view by ID
export const getMenuViewById = async (id) => {
  try {
    const response = await api.get(`/advanceMenuView/get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting menu view by ID:", error);
    throw error;
  }
};

// Save customers menu item selection
export const saveCustomerMenuSelection = async (booking_id, ICMT_Id) => {
  try {
    const response = await api.post('/customerMenuSelection/', {
      booking_id,
      ICMT_Id,
    });
    return response.data;
  } catch (error) {
    console.error("Error saving customers menu selection:", error);
    throw error;
  }
};

// Check if booking_id exists in customers menu selection
export const checkBookingMenuSelection = async (booking_id) => {
  try {
    const response = await api.get(`/customerMenuSelection/check-booking/${booking_id}`);
    return response.data.exists;
  } catch (error) {
    console.error("Error checking booking menu selection:", error);
    throw error;
  }
};

////////////////////////////////////////////////////////////////////////////////////

// Get summary by booking_id
export const getSummaryByBookingId = async (booking_id) => {
  try {
    const response = await api.get(`/summary/${booking_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching summary:", error);
    throw error;
  }
};

/////////////////////////////////////////
//admin correct menu selections
////////////////////////////////////////////////

export const getAllStructuredMenuSelections = async () => {
  try {
    const response = await api.get('/AdminCorrectMenus/structured');
    return response.data;
  } catch (error) {
    console.error("Error fetching all structured menu selections:", error);
    throw error;
  }
};

export const deleteCustomerSelectMenu = async (booking_id) => {
    const response = await api.delete(`/AdminCorrectMenus/${booking_id}`);
    return response.data;
}
export const deleteMenuPriceFromBookingDetails = async (booking_id) => {
    const response = await api.put(`/AdminCorrectMenus/bookingPrice/${booking_id}`);
    return response.data;
}



/**
 * Gets structured menu selections by booking ID
 * @param {string} booking_id - The booking ID
 * @returns {Promise<Array>} Array of structured menu selections for the booking
 */
export const getStructuredSelectionsByBookingId = async (booking_id) => {
  try {
    const response = await api.get(`/AdminCorrectMenus/structured/booking/${booking_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching structured menu selections by booking ID:", error);
    throw error;
  }
};

/**
 * Gets structured menu selections by customers ID
 * @param {string} customer_id - The customers ID
 * @returns {Promise<Array>} Array of structured menu selections for the customers
 */
export const getStructuredSelectionsByCustomerId = async (customer_id) => {
  try {
    const response = await api.get(`/AdminCorrectMenus/structured/customers/${customer_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching structured menu selections by customers ID:", error);
    throw error;
  }
};

/**
 * Creates a new menu selection
 * @param {Object} selectionData - The menu selection data
 * @param {string} selectionData.booking_id - The booking ID
 * @param {string} selectionData.ICMT_Id - The menu item ID
 * @returns {Promise<Object>} The created menu selection
 */
export const createMenuSelection = async (selectionData) => {
  try {
    const response = await api.post('/AdminCorrectMenus/', selectionData);
    return response.data;
  } catch (error) {
    console.error("Error creating menu selection:", error);
    throw error;
  }
};

/**
 * Updates an existing menu selection
 * @param {string} booking_id - The booking ID
 * @param {string} oldICMT_Id - The old menu item ID
 * @param {Object} updateData - The update data
 * @returns {Promise<Object>} The updated menu selection
 */
export const updateMenuSelection = async (booking_id, oldICMT_Id, updateData) => {
  try {
    const response = await api.put(`/AdminCorrectMenus/${booking_id}/${oldICMT_Id}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating menu selection:", error);
    throw error;
  }
};

/**
 * Deletes a menu selection
 * @param {string} booking_id - The booking ID
 * @param {string} ICMT_Id - The menu item ID
 * @returns {Promise<Object>} The deletion result
 */
export const deleteMenuSelection = async (booking_id, ICMT_Id) => {
  try {
    const response = await api.delete(`/AdminCorrectMenus/${booking_id}/${ICMT_Id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting menu selection:", error);
    throw error;
  }
};

/**
 * Checks if a booking has menu selections
 * @param {string} booking_id - The booking ID to check
 * @returns {Promise<boolean>} True if booking exists in selections, false otherwise
 */
export const checkBookingMenuSelections = async (booking_id) => {
  try {
    const selections = await getStructuredSelectionsByBookingId(booking_id);
    return selections.length > 0;
  } catch (error) {
    console.error("Error checking booking menu selection:", error);
    throw error;
  }
};

/**
 * Saves a customers menu item selection
 * @param {string} booking_id - The booking ID
 * @param {string} ICMT_Id - The menu item ID
 * @returns {Promise<Object>} The saved menu selection
 */
export const saveCustomersMenuSelection = async (booking_id, ICMT_Id) => {
  try {
    const response = await api.post('/AdminCorrectMenus/', {
      booking_id,
      ICMT_Id,
    });
    return response.data;
  } catch (error) {
    console.error("Error saving customers menu selection:", error);
    throw error;
  }
};

export const updateMenuStructure = async (payload) => {
  try {
    const response = await api.put('/AdminCorrectMenus/structure', payload);
    return response.data;
  } catch (error) {
    console.error("Error updating menu structure:", error);
    throw error;
  }
};



////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

export const MenuSelectionService = {
  // Get all menu selections for a booking (flat structure)
  getMenuSelections: async (bookingId) => {
    try {
      const response = await api.get(`/orders/choices/${bookingId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 
        'Failed to fetch menu selections'
      );
    }
  },

  // Get structured menu selections (hierarchical format)
  getStructuredMenuSelections: async (bookingId) => {
    try {
      const response = await api.get(`/orders/choices-details/${bookingId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 
        'Failed to fetch structured menu selections'
      );
    }
  },

  // Add a new menu selection
  createMenuSelection: async (bookingId, ICMT_Id) => {
    try {
      const response = await api.post(`/orders/add-choice/${bookingId}`, { ICMT_Id });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 
        'Failed to create menu selection'
      );
    }
  },

  // Swap/update a menu selection
  updateMenuSelection: async (bookingId, oldICMT_Id, newICMT_Id) => {
    try {
      const response = await api.patch(
        `/orders/${bookingId}/swap-choice/${oldICMT_Id}`,
        { newICMT_Id }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 
        'Failed to update menu selection'
      );
    }
  },

  // Remove a specific menu selection
  deleteMenuSelection: async (bookingId, ICMT_Id) => {
    try {
      const response = await api.delete(
        `/orders/${bookingId}/remove-choice/${ICMT_Id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 
        'Failed to delete menu selection'
      );
    }
  },

  // Remove all menu selections for a booking
  deleteAllMenuSelections: async (bookingId) => {
    try {
      const response = await api.delete(
        `/orders/reset-choices/${bookingId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 
        'Failed to delete all menu selections'
      );
    }
  }
};

// Additional utility functions if needed
export const getMenuSelectionDetails = async (bookingId) => {
  try {
    const [flatSelections, structuredSelections] = await Promise.all([
      MenuSelectionService.getMenuSelections(bookingId),
      MenuSelectionService.getStructuredMenuSelections(bookingId)
    ]);
    return { flatSelections, structuredSelections };
  } catch (error) {
    throw new Error('Failed to get comprehensive menu selection details');
  }
};

export const bulkUpdateMenuSelections = async (bookingId, updates) => {
  try {
    // First delete all existing selections
    //await MenuSelectionService.deleteAllMenuSelections(bookingId);
    await deleteCustomerSelectMenu(bookingId)
    // Then add all new selections
    const results = await Promise.all(
      updates.map(ICMT_Id => 
        MenuSelectionService.createMenuSelection(bookingId, ICMT_Id)
      )
    );
    
    return results;
  } catch (error) {
    throw new Error('Failed to perform bulk update of menu selections');
  }
};