// routes/order.routes.js

import express from 'express';
import {getMenu,placeOrder,getCustomerOrders,getAllOrders,updateOrderStatus} from  '../controllers/customer/orderController.js';

const router = express.Router();

router.get('/menu', getMenu);

router.post('/orders', placeOrder);

router.get('/orders/:customerId', getCustomerOrders);

// Route to get all orders
router.get('/orders', getAllOrders);

// Route to update an order's status
router.put('/orders/:orderId/status', updateOrderStatus);

export default router;