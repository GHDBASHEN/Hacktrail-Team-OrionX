// routes/order.routes.js

import express from 'express';
import {createOrder,getMyOrders,cancelMyOrder,getAllOrders,updateOrderStatus,getOrderById} from  '../controllers/customer/orderController.js';

const router = express.Router();

// --- Student Routes ---
// POST /api/orders -> Create a new order
router.post('/:customerId', createOrder);

// GET /api/orders/my-orders -> Get the logged-in student's order history
router.get('/my-orders/:customerId',getMyOrders);

// PATCH /api/orders/:id/cancel -> A student cancels their own order
router.patch('/:id/cancel',cancelMyOrder);


// --- Admin Routes ---
// GET /api/orders -> Get all orders in the system
router.get('/',  getAllOrders);

// PATCH /api/orders/:id/status -> Update the status of any order
router.patch('/:id/status',updateOrderStatus);


// --- Shared Route (Student & Admin) ---
// GET /api/orders/:id -> Get details of a specific order
router.get('/:id',getOrderById);


export default router;