import api from './Api';

export const getProfile = async (id) => {
  const response = await api.get(`/setting/profile/${id}`);
  return response.data;
};

export const updateProfile = async (id, data) => {
  const response = await api.put(`/setting/profile/${id}`, data);
  return response.data;
};

export const changePassword = async (id, data) => {
  const response = await api.put(`/setting/password/${id}`, data);
  return response.data;
};

export const getAdmins = async () => {
  const response = await api.get(`/setting/admins`);
  return response.data;
};

export const getEmployees = async () => {
  const response = await api.get(`/setting/employees`);
  return response.data;
};

export const assignRole = async (employeeId, role, password, adminId) => {
  const response = await api.put(`/setting/admins`, {
    employeeId,
    role,
    password,
    adminId
  })
  return response.data
}

export const deactivateAdmin = async (id) => {
  const response = await api.delete(`/setting/admins/${id}`);
  return response.data;
};

