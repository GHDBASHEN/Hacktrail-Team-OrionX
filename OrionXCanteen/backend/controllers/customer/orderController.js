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

export const getCustomerOrders = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        if (!customerId) {
            return res.status(400).json({ message: "Customer ID is required." });
        }

        const orders = await OrderModel.findOrdersByCustomerId(customerId);
        
        res.status(200).json(orders);

    } catch (error) {
        console.error("Error in getCustomerOrders controller:", error);
        res.status(500).json({ message: "Failed to retrieve orders.", error: error.message });
    }
};

// Get all orders for the admin dashboard
export const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve orders.", error: error.message });
    }
};

// Update the status of a specific order
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "New status is required." });
        }

        const success = await OrderModel.updateOrderStatus(orderId, status);
        
        if (success) {
            res.status(200).json({ message: "Order status updated successfully." });
        } else {
            res.status(404).json({ message: "Order not found." });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to update order status.", error: error.message });
    }
};
