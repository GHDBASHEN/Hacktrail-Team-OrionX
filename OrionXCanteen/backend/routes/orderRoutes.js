// routes/order.routes.js

import express from 'express';
import {getMenu,placeOrder,getCustomerOrders} from  '../controllers/customer/orderController.js';

const router = express.Router();

router.get('/menu', getMenu);

router.post('/orders', placeOrder);

router.get('/orders/:customerId', getCustomerOrders);



export default router;