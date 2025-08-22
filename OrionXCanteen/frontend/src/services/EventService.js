import api from './Api';

// Create a wedding event
export const createWedding = async (formData) => {
  const response = await api.post('/wedding/createWedding', formData);
  return response.data;
};

// Create an event
export const createEvents = async (formData) => {
  const response = await api.post('/event/createCustomEvents', formData);
  return response.data;
};

// Get customers bookings
export const getCustomerBookings = async (customerID) => {
  try {
    const response = await api.get(`/customers/${customerID}`);
    return response.data.data;
  } catch (error) {
    console.error("You Have No Bookings:", error);
    throw error;
  }
};

export const getTotalCustomerBookings = async (customerID) => {
  try {
    const response = await api.get(`/customers/getTotalBookingEvents/${customerID}`);
    return response.data.data;
  } catch (error) {
    console.error("You Have No Bookings:", error);
    throw error;
  }
};




export const getPlannedEvents = async (customerID, bookingID) => {
  try {
    const response = await api.get(`/displayEvents/${customerID}/${bookingID}`);
    return response.data.data;
  } catch (error) {
    console.error("You Have No Planned Events:", error);
    throw error;
  }
};

export const updatetheEvent = async (eventId, eventData) => {
  try {
    const response = await api.put(`/displayEvents/updateEvent/${eventId}`, eventData);
    return response.data.event; // Return updated event object
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Event update failed. Please try again.'
    );
  }
};

export const deletetheEvent = async (eventId) => {
  try {
    const response = await api.delete(`/displayEvents/deleteEvent/${eventId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || 
      'Failed to delete event. Please try again.'
    );
  }
};



const BASE_URL = "http://localhost:8000";

export const getEventServices = async () => {
  try {
    const response = await api.get('/EventService/getEventService');

    // Map response to include full image URLs
    return response.data.data.map(service => ({
      Event_Service_ID: service.id,
      Event_Service_Name: service.name,
      Event_Service_Image: service.imagePath
        ? `${BASE_URL}${service.imagePath}`
        : null
    }));
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};


export const saveSelectedServices = async (customerId, bookingId, services) => {
  try {
    const response = await api.post('/CustomerService/saveServices', {
      customerId,
      bookingId,
      serviceIds: services
    });
    return response.data;
  } catch (error) {
    console.error("Save error:", error);
    throw new Error(error.response?.data?.message || "Failed to save services");
  }
};

export const getServiceVendors = async (customerId, bookingId) => {
  try {
    const response = await api.get(`/VendorServices/getServiceVendors/${customerId}/${bookingId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching vendors:", error);
    throw new Error(error.response?.data?.message || "Failed to load vendors");
  }
};

export const getTableDesigns = async () => {
  try {
    const response = await api.get('/tableArrangement/get-table-designs');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch table designs');
  }
};

export const createOrUpdateArrangement = async (bookingId, data) => {
  try {
    const response = await api.post(`/tableArrangement/createTableArrangement/${bookingId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to save arrangement');
  }
};

export const createReservation = async (bookingId, data) => {
  try {
    const response = await api.post(`/reservation/createReservation/${bookingId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create reservation');
  }
};


export const getArrangementsByBooking = async (bookingId) => {
  try {
    const response = await api.get(`/tableArrangement/getTableArrangement/${bookingId}`);
    return response.data; // Directly return the array of arrangements
  } catch (error) {
    if (error.response?.status === 404) return []; // Return empty array for 404
    throw new Error(error.response?.data?.error || 'Failed to fetch arrangements');
  }
};

export const getReservationsByBooking = async (bookingId) => {
  try {
    const response = await api.get(`/reservations/${bookingId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch reservations');
  }
};

export const createPlanBar = async (bookingId, planBarData) => {
  try {
    const response = await api.post(`/Bar/planBar/${bookingId}`, planBarData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to save bar plan');
  }
};

export const updatePlanBar = async (bookingId, data) => {
  try {
    const response = await api.put(`/Bar/updatePlanBar/${bookingId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update bar plan');
  }
};

export const deletePlanBar = async (bookingId) => {
  try {
    const response = await api.delete(`/Bar/deletePlanBar/${bookingId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete bar plan');
  }
};

export const getPlanBar = async (bookingId) => {
  try {
    const response = await api.get(`/Bar/getPlanBar/${bookingId}`);
    return response.data?.data || null;
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw new Error(error.response?.data?.error || 'Failed to fetch bar plan');
  }
};

// Bite Menu Services
export const getBiteMenuItems = async () => {
  try {
    const response = await api.get('/Bite/bite-menu-items');
    return response.data.data || []; // Directly return data array
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch menu items');
  }
};

export const PlanBiteMenu = async (bookingId, data) => {
  try {
    const response = await api.post(`/Bite/planBite/${bookingId}`, { biteItems: data });
    return response.data.data; // Return direct data
  } catch (error) {
    const message = error.response?.data?.error || 'Failed to save bite menu';
    throw new Error(message);
  }
};

export const getBiteMenu = async (bookingId) => {
  try {
    const response = await api.get(`/Bite/getPlanBite/${bookingId}`);
    return {
      biteItems: response.data?.data?.biteItems || [], // Now matches backend
      totalPrice: response.data?.data?.totalPrice || 0
    };
  } catch (error) {
    return { biteItems: [], totalPrice: 0 };
  }
};

export const UpdateBiteMenu = async (bookingId, data) => {
  try {
    const response = await api.put(`/Bite/updatePlanBite/${bookingId}`, { biteItems: data });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update bite menu');
  }
};

export const deleteBiteMenu = async (bookingId) => {
  try {
    await api.delete(`/Bite/deletePlanBite/${bookingId}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete bite menu');
  }
};




export const BarService = {

  // Liquor Item Services
  addLiquorItem: async (bookingId, data) => {
    try {
      const response = await api.post(`/BarArrange/liquor/${bookingId}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add liquor item');
    }
  },

  updateLiquorItem: async (bookingId, itemId, data) => {
    try {
      const response = await api.put(`/BarArrange/liquor/${bookingId}/${itemId}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update liquor item');
    }
  },

  deleteLiquorByName: async (bookingId, itemId) => {
    try {
      const response = await api.delete(`/BarArrange/liquor/${bookingId}/${itemId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete liquor items');
    }
  },

  deleteSoftDrinkByName: async (bookingId, itemId) => {
    try {
      const response = await api.delete(`/BarArrange/soft-drinks/${bookingId}/${itemId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete soft drink items');
    }
  },

  // Soft Drink Item Services
  addSoftDrinkItem: async (bookingId, data) => {
    try {
      const response = await api.post(`/BarArrange/soft-drinks/${bookingId}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add soft drink item');
    }
  },

  updateSoftDrinkItem: async (bookingId, itemId, data) => {
    try {
      const response = await api.put(`/BarArrange/soft-drinks/${bookingId}/${itemId}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update soft drink item');
    }
  },

  // General Bar Services
  getBarDetails: async (bookingId) => {
    try {
      const response = await api.get(`/BarArrange/barDetails/${bookingId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch bar details');
    }
  }
};

// Admin Services


export const getAssignmentOptions = async () => {
  try {
    const response = await api.get('/assignedEmployee/getAssignmentOptions');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch assignment options');
  }
};

export const assignEmployeeToEvent = async (data) => {
  try {
    const response = await api.post('/assignedEmployee/assignToEvent', data);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Assignment failed');
  }
};

export const getAssignments = async () => {
  try {
    const response = await api.get('/assignedEmployee/assignments');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get assignments');
  }
};

export const updateAssignment = async (assignmentId, data) => {
  try {
    const response = await api.put(`/assignedEmployee/assignments/${assignmentId}`, data);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Update failed');
  }
};

export const deleteAssignment = async (assignmentId) => {
  try {
    await api.delete(`/assignedEmployee/assignments/${assignmentId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Delete failed');
  }
};


//wedding admin

//  export const getAllEvents = async () => {
//     try {
//       const response = await api.get('/AdminEvents/events');
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.error || 'Failed to fetch events');
//     }
//   };

//    export const createEvent = async (eventType, data) => {
//     try {
//       const response = await api.post('/AdminEvents/events', { eventType, data });
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.error || 'Event creation failed');
//     }
//   };

//    export const  updateEvent = async (eventId, eventType, data) => {
//     try {
//       const response = await api.put(`/AdminEvents/events/${eventId}`, { eventType, data });
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.error || 'Event update failed');
//     }
//   };

//    export const deleteEvent = async (eventId, eventType) => {
//     try {
//       await api.delete(`/AdminEvents/events/${eventId}`, { data: { eventType } });
//     } catch (error) {
//       throw new Error(error.response?.data?.error || 'Event deletion failed');
//     }
//   };

export const getEventById = async (eventId) => {
  try {
    const response = await api.get(`/AdminEvents/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch event');
  }
};

export const getAllEvents = async () => {
  try {
    const response = await api.get('/AdminEvents/events');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch events');
  }
};

export const updateEvent = async (eventId, data) => {
  try {
    const response = await api.put(`/AdminEvents/events/${eventId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Event update failed');
  }
};

export const deleteEvent = async (eventId) => {
  try {
    await api.delete(`/AdminEvents/events/${eventId}`);
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Event deletion failed');
  }
};

export const uploadServiceImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    // Change '/upload' to '/api/upload'
    const response = await api.post('/AdminEvents/uploadServiceImage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.filePath;
  } catch (error) {
    throw new Error('Image upload failed: ' + (error.response?.data?.error || error.message));
  }
};

// Get all event services
export const getAdminEventServices = async () => {
  try {
    const response = await api.get('/AdminEvents/getAdminEventServices');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch services');
  }
};

// Create new event service
export const createAdminEventService = async (serviceData) => {
  try {
    const response = await api.post('/AdminEvents/createAdminEventService', serviceData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create service');
  }
};

// Update existing event service
export const updateAdminEventService = async (id, serviceData) => {
  try {
    const response = await api.put(`/AdminEvents/updateAdminEventService/${id}`, serviceData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update service');
  }
};

// Delete event service
export const deleteAdminEventService = async (id) => {
  try {
    await api.delete(`/AdminEvents/deleteAdminEventService/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete service');
  }
};

// Get service by ID
export const getEventServiceById = async (id) => {
  try {
    const response = await api.get(`/AdminEvents/getAdminEventServices/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch service');
  }
};







//  Admin Vendor Services
export const getAdminVendors = async () => {
  try {
    const response = await api.get('/AdminEvents/getAllVendors');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch vendors');
  }
};

export const createAdminVendor = async (vendorData) => {
  try {
    const response = await api.post('/AdminEvents/createVendor', vendorData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create vendor');
  }
};

export const updateAdminVendor = async (id, vendorData) => {
  try {
    const response = await api.put(`/AdminEvents/updateVendor/${id}`, vendorData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update vendor');
  }
};

export const deleteAdminVendor = async (id) => {
  try {
    await api.delete(`/AdminEvents/deleteVendor/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete vendor');
  }
};

export const getVendorById = async (id) => {
  try {
    const response = await api.get(`/AdminEvents/getAllVendors/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch vendor');
  }
};

export const getVendorServices = async (vendorId) => {
  try {
    // Use the correct backend route
    const response = await api.get(`/AdminEvents/getVendorServices/${vendorId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch vendor services');
  }
};

// Remove or update getAllEventServicesSimple if not implemented in backend
export const getAllEventServicesSimple = async () => {
  try {
    // If this route does not exist, use a working route or implement it in backend
    const response = await api.get('/AdminEvents/getAllEventServicesSimple');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch event services');
  }
};

export const assignServicesToVendor = async (vendorId, serviceIds) => {
  try {
    const response = await api.post(`/AdminEvents/assignServicesToVendor/${vendorId}`, { serviceIds });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to assign services to vendor');
  }
};



// Customer Event Services

export const getAllCustomerEventServices = async () => {
  try {
    const response = await api.get('/AdminEvents/customers-event-services');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch customers event services');
  }
};

export const getCustomerEventServiceById = async (id) => {
  try {
    const response = await api.get(`/AdminEvents/customers-event-services/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch service details');
  }
};

export const createCustomerEventService = async (data) => {
  try {
    const response = await api.post('/AdminEvents/customers-event-services', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create service');
  }
};

export const updateCustomerEventService = async (id, data) => {
  try {
    const response = await api.put(`/AdminEvents/customers-event-services/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update service');
  }
};

export const deleteCustomerEventService = async (id) => {
  try {
    await api.delete(`/AdminEvents/customers-event-services/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete service');
  }
};

export const getAllCustomers = async () => {
  try {
    const response = await api.get('/AdminEvents/getAllCustomers');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch customers');
  }
};


// Get all bookings with customers information
export const getAllBookings = async () => {
  try {
    const response = await api.get('/AdminEvents/getAllBookings');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch bookings');
  }
};

export const getAllEventServicesCustomer = async () => {
  try {
    // If this route does not exist, use a working route or implement it in backend
    const response = await api.get('/AdminEvents/getAllEventServicesCustomer');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch event services');
  }
};


// Get all arrangements

export const getAllArrangements = async () => {
  try {
    const response = await api.get('/AdminEvents/getadminTableChair');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch arrangements');
  }
};

// Get all events for table chair

export const getadminTableChair = async () => {
  try {
    const response = await api.get('/AdminEvents/geteventsForTable');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch arrangements');
  }
};


// Get a single arrangement by ID
export const getArrangementById = async (id) => {
  try {
    const response = await api.get(`/AdminEvents/getadminTableChair/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch arrangement');
  }
};

// Create a new arrangement with reservations
export const createArrangement = async (arrangementData) => {
  try {
    const response = await api.post('/AdminEvents/createadminTableChair', arrangementData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create arrangement');
  }
};

// Update an existing arrangement
export const updateArrangement = async (id, arrangementData) => {
  try {
    const response = await api.put(`/AdminEvents/updateadminTableChair/${id}`, arrangementData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update arrangement');
  }
};

// Delete an arrangement
export const deleteArrangement = async (id) => {
  try {
    const response = await api.delete(`/AdminEvents/deleteadminTableChair/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete arrangement');
  }
};

// Get all table reservations (if needed separately)
export const getAllTableReservations = async () => {
  try {
    const response = await api.get('/AdminEvents/reservations');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch reservations');
  }
};

// Create a table reservation (if needed separately)
export const createTableReservation = async (reservationData) => {
  try {
    const response = await api.post('/AdminEvents/reservations', reservationData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create reservation');
  }
};

export const getAllTableDesigns = async () => {
  try {
    const response = await api.get('/AdminEvents/get-table-designs');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch table designs');
  }
};

export const getTableDesignById = async (id) => {
  try {
    const response = await api.get(`/AdminEvents/get-table-designs/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch table design');
  }
};

export const createTableDesign = async (designData) => {
  try {
    const response = await api.post('/AdminEvents/create-table-designs', designData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create table design');
  }
};

export const updateTableDesign = async (id, designData) => {
  try {
    const response = await api.put(`/AdminEvents/update-table-designs/${id}`, designData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update table design');
  }
};

export const deleteTableDesign = async (id) => {
  try {
    const response = await api.delete(`/AdminEvents/delete-table-designs/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete table design');
  }
};


// Bar Times CRUD
export const createBarTime = async (barData) => {
  try {
    const response = await api.post('/AdminEvents/bar-times', barData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create bar time');
  }
};

export const getAllBarTimes = async () => {
  try {
    const response = await api.get('/AdminEvents/bar-times');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch bar times');
  }
};

export const getBarTimeById = async (id) => {
  try {
    const response = await api.get(`/AdminEvents/bar-times/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch bar time');
  }
};

export const updateBarTime = async (id, barData) => {
  try {
    const response = await api.put(`/AdminEvents/bar-times/${id}`, barData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update bar time');
  }
};

export const deleteBarTime = async (id) => {
  try {
    const response = await api.delete(`/AdminEvents/bar-times/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete bar time');
  }
};

// Bite Menu CRUD
export const createBite = async (biteData) => {
  try {
    const response = await api.post('/AdminEvents/bite-menu', biteData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create bite item');
  }
};

export const getAllBites = async () => {
  try {
    const response = await api.get('/AdminEvents/bite-menu');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch bite items');
  }
};

export const getBitesByBar = async (barId) => {
  try {
    const response = await api.get(`/AdminEvents/bite-menu/bar/${barId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch bites by bar');
  }
};

export const updateBite = async (id, biteData) => {
  try {
    const response = await api.put(`/AdminEvents/bite-menu/${id}`, biteData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update bite item');
  }
};

export const deleteBite = async (id) => {
  try {
    const response = await api.delete(`/AdminEvents/bite-menu/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete bite item');
  }
};

// Liquor Items CRUD
export const createLiquorItem = async (liquorData) => {
  try {
    const response = await api.post('/AdminEvents/liquor-items', liquorData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create liquor item');
  }
};

export const getAllLiquorItems = async () => {
  try {
    const response = await api.get('/AdminEvents/liquor-items');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch liquor items');
  }
};

export const getLiquorByBar = async (barId) => {
  try {
    const response = await api.get(`/AdminEvents/liquor-items/bar/${barId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch liquor by bar');
  }
};

export const updateLiquorItem = async (id, liquorData) => {
  try {
    const response = await api.put(`/AdminEvents/liquor-items/${id}`, liquorData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update liquor item');
  }
};

export const deleteLiquorItem = async (id) => {
  try {
    const response = await api.delete(`/AdminEvents/liquor-items/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete liquor item');
  }
};

// Soft Drink Items CRUD
export const createSoftDrinkItem = async (softDrinkData) => {
  try {
    const response = await api.post('/AdminEvents/soft-drink-items', softDrinkData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create soft drink item');
  }
};

export const getAllSoftDrinkItems = async () => {
  try {
    const response = await api.get('/AdminEvents/soft-drink-items');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch soft drink items');
  }
};

export const getSoftDrinksByBar = async (barId) => {
  try {
    const response = await api.get(`/AdminEvents/soft-drink-items/bar/${barId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch soft drinks by bar');
  }
};

export const updateSoftDrinkItem = async (id, softDrinkData) => {
  try {
    const response = await api.put(`/AdminEvents/soft-drink-items/${id}`, softDrinkData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update soft drink item');
  }
};

export const deleteSoftDrinkItem = async (id) => {
  try {
    const response = await api.delete(`/AdminEvents/soft-drink-items/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete soft drink item');
  }
};


export const getEventProgress = async (bookingId) => {
    try {
        const response = await api.get(`/progress/customerDashboard/${bookingId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching event progress:", error);
        throw error;
    }
};

export const downloadReportAPI = async (bookingId) => {
    try {
        const response = await api.get(`/pdf/events/${bookingId}`, {
            responseType: 'blob',
            validateStatus: (status) => status < 500 // Accept all status codes < 500
        });

        // Handle non-200 responses
        if (response.status !== 200) {
            let errorMessage = 'Failed to download report';
            
            // Try to parse error message if not a blob
            if (response.data instanceof Blob) {
                const text = await response.data.text();
                try {
                    const errorData = JSON.parse(text);
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    errorMessage = text || errorMessage;
                }
            }
            
            throw new Error(errorMessage);
        }

        return response.data;
    } catch (error) {
        console.error("Error downloading report:", error.message);
        throw error;
    }
};

export const getAllBookingReports = async () => {
    try {
        const response = await api.get('/pdf/booking-reports');
        return response.data;
    } catch (error) {
        console.error('Error fetching booking reports:', error);
        throw error;
    }
};