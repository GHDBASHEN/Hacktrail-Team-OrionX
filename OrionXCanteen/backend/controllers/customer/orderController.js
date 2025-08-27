import * as OrderModel from '../../models/customer/orderModel.js';

// Controller to fetch the menu for the day
export const getMenu = async (req, res) => {
    try {
        const menu = await OrderModel.getTodaysMenu();
        res.status(200).json(menu);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve the menu.", error: error.message });
    }
};

// Controller to place a new order
export const placeOrder = async (req, res) => {
    try {
        // Assuming customer ID is available from an auth middleware, e.g., req.user.id
        // For now, we'll get it from the request body for testing.
        const { customerId, cartItems } = req.body;

        if (!customerId || !cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "Customer ID and cart items are required." });
        }

        const orderDetails = await OrderModel.createOrder(customerId, cartItems);
        
        res.status(201).json({ 
            message: "Order placed successfully!", 
            orderId: orderDetails.order_id, // This is the token
            totalAmount: orderDetails.total_amount
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to place order.", error: error.message });
    }
};
