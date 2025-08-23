import express from 'express';
import { getDailyMenu } from '../controllers/customer/menuController.js';

const router = express.Router();

// GET /api/menu/today -> Get the menu for the current date
router.get('/today', getDailyMenu);

export default router;