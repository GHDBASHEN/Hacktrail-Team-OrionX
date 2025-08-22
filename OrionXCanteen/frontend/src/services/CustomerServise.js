import api from './Api';

export const addCustomer = async (cusData) => {
  try {
    const response = await api.post(`/user/addCustomer/`, cusData);
    return response.data;
  } catch (error) {
    console.error('Error adding customers:', error);
    throw error;
  }
};

export const searchCustomer = async (searchTerm) => {
  const response = await api.get(`/user/searchCustomer`, {
    params: { q: searchTerm }
  });
  return response.data;
};

export const getCusName = async (id) => {
  try {
    //const response = await api.get(`/user/getCusName/${id}`);
    const response = await api.get(`/user/getCusName`, {
      params: { id: id }  // <- this sends ?q=value in the URL
    });
    return response.data; // Adjust based on your API response structure
  } catch (error) {
    console.error('Error fetching customers name:', error);
    return 'Unknown'; // Return a fallback value in case of an error
  }
};

// src/services/CustomerService.js
export const getAllCustomers = async () => {
  try {
    const response = await api.get('/user/getAllCustomers');
    return response.data;
  } catch (error) {
    console.error('Error getting all customers:', error);
    throw error;
  }
};

export const updateCustomer = async (customerId, data) => {
  try {
    const response = await api.put(`/user/updateCustomer/${customerId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating customers:', error);
    throw error;
  }
};

export const getCustomerBookings = async (customerId) => {
  try {
    const response = await api.get(`/user/getCustomerBookings/${customerId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting customers bookings:', error);
    throw error;
  }
};
