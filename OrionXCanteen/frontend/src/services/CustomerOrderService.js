import api from './Api';

export const getTodaysMenu = async () => {
    const response = await api.get('/menu/today');
    return response.data;
};

// The customerId parameter is no longer needed here
export const createOrder = async (customerId, orderData) => {
    // 2. Use a template literal to include the customerId in the URL
    const response = await api.post(`/orders/create/${customerId}`, orderData);
    return response.data;
};

export const getMyOrders = async (customerId) => {
    const response = await api.get(`/orders/my-orders/${customerId}`);
    return response.data;
};


export const cancelMyOrder = async (orderId) => {
    const response = await api.patch(`/orders/${orderId}/cancel`);
    return response.data;
};
