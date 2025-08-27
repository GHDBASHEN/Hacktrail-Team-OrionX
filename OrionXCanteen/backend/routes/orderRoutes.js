// routes/order.routes.js

import express from 'express';
import {getMenu,placeOrder} from  '../controllers/customer/orderController.js';

const router = express.Router();

router.get('/menu', getMenu);

router.post('/orders', placeOrder);





export default router;