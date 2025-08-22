import api from './Api';
import api_local from './ApiLocal';

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data; // Returns user emailOrPhone, id, role, token, refresh token
};

export const registerEmployee = async (employeeData) => {
  const response = await api.post('/auth/register-employees', employeeData);
  return response.data; // Returns success message
};

export const registerCustomer = async (customerData) => {
  console.log('Registering customers with data:', customerData);
  const response = await api.put('/auth/register-customers', customerData);
  return response.data; // Returns success message
};

export const updateCustomerPassword = async (customerData) => {
  console.log('Updating customers password with data:', customerData); 
  const response = await api.put('/auth/update-customers-password', customerData);
  return response.data; // Returns success message
}

export const validateEmail = async (email) => {
  try {
    const response = await api.get(`/auth/check-email?email=${email}`);
    return response.data; // Returns success message
  } catch (error) {
    return error.response?.data || { message: "An error occurred" };
  }
};

export const sendOtp = async (email) => {
  const response = await api.post('/auth/forgot-password', email);
  return response.data; // Returns success message
};

export const validateOtp = async (data) => {
  const response = await api.post('/auth/validate-otp', data);
  return response.data; // Returns success message
};

export const updateUserPassword = async (data) => {
  const response = await api.put('/auth/update-password', data);
  return response.data; // Returns success message
}