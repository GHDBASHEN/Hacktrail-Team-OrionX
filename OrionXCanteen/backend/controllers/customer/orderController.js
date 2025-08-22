// controllers/order.controller.js

import * as orderModel from '../../models/customer/orderModel.js';

// CREATE: Handles creation of a new order
export const createOrder = async (req, res) => {
    try {
        // Ensure the user object and ID exist from the auth middleware

        const customerId = req.params.customerId;
        
        const { items, specialNotes } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Order must contain at least one item." });
        }
        
        const result = await orderModel.create(customerId, items, specialNotes);
        res.status(201).json({ message: "Order placed successfully!", ...result });

    } catch (error) {
        // --- IMPROVED ERROR LOGGING ---
        console.error("CREATE ORDER FAILED:", error); // This will show the detailed SQL error in your terminal
        
        res.status(500).json({ 
            message: "Failed to place order.",
            error: error.message // Optionally send the error message back in the response for easier debugging
        });
    }
};

// READ: Get a single order by ID
export const getOrderById = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }
        // Security check: Allow access only to the order owner or an admin
        if (req.user.role !== 'admin' && order.customer_id !== req.user.id) {
             return res.status(403).json({ message: "Access denied." });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve order." });
    }
};

// READ: Get all orders for the logged-in student
export const getMyOrders = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const orders = await orderModel.findAllByCustomer(customerId);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve your orders." });
    }
};

// READ: Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.findAll();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve all orders." });
    }
};

// UPDATE: Update order status (Admin only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: "Status is required." });
        }
        const success = await orderModel.updateStatus(req.params.id, status);
        if (success) {
            res.status(200).json({ message: "Order status updated successfully." });
        } else {
            res.status(404).json({ message: "Order not found or status could not be updated." });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to update order status." });
    }
};

// CANCEL: Student cancels their own order
export const cancelMyOrder = async (req, res) => {
    try {

        const customerId = req.params.customerId;
        const success = await orderModel.cancel(req.params.id, customerId);
        if (success) {
            res.status(200).json({ message: "Order cancelled successfully." });
        } else {
            res.status(404).json({ message: "Order not found, already processed, or you do not have permission to cancel it." });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to cancel order." });
    }
};