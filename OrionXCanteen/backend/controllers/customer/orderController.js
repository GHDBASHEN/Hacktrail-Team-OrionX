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
        const { customerId, cartItems } = req.body;

        if (!customerId || !cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "Customer ID and cart items are required." });
        }

        // The model returns { orderId, totalAmount }
        const orderDetails = await OrderModel.createOrder(customerId, cartItems);
        
        // **FIX**: Use the correct property names returned from the model
        res.status(201).json({ 
            message: "Order placed successfully!", 
            orderId: orderDetails.orderId, // Changed from order_id
            totalAmount: orderDetails.totalAmount // Changed from total_amount
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to place order.", error: error.message });
    }
};
