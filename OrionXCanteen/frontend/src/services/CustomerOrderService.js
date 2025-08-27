import api from './Api';

// Fetches today's menu (both daily and standard items)
export const getTodaysMenu = async () => {
    const response = await api.get('/customer/menu');
    return response.data;
};

// Places a new order
export const placeOrder = async (orderData) => {
    // orderData should look like: { customerId: '...', cartItems: [...] }
    const response = await api.post('/customer/orders', orderData);
    return response.data;
};