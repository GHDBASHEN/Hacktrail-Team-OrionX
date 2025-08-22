import api from './Api';  // your preconfigured axios instance

const BASE = '/overview';

export const OverViewService = {
  getKpis: async () => {
    try {
      const res = await api.get(`${BASE}/kpis`);
      return res.data;
    } catch (err) {
      console.error("Error in getKpis:", err);
      throw err; // or return default value
    }
  },

  getRevenueTrend: async () => {
    try {
      const res = await api.get(`${BASE}/revenue-trend`);
      return res.data;
    } catch (err) {
      console.error("Error in getRevenueTrend:", err);
      throw err;
    }
  }
};

export const getRecentBookings = async () => {
  try {
    const response = await api.get(`${BASE}/recent-bookings`);
    return response.data;
  } catch (err) {
    console.error("Error in getRecentBookings:", err);
    throw err;
  }
};
