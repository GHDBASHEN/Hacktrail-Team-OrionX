import api from './Api';

export const getTodaysMenu = async () => {
    const response = await api.get('/menu/today');
    return response.data;
};


export const createOrder = async (customerId, orderData) => {
    // Using the route structure: POST /api/orders/:customerId
    const response = await api.post(`/orders/${customerId}`, orderData);
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
