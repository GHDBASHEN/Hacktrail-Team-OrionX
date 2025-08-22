
import express from 'express';
import { createFood, getAllFoods, updateFood, deleteFood } from '../controllers/admin/foodController.js';

const router = express.Router();


// POST /api/foods -> Create a new food item
router.post('/', createFood);

// GET /api/foods -> Get all food items
router.get('/', getAllFoods);

// PUT /api/foods/:id -> Update a food item
router.put('/:id', updateFood);

// DELETE /api/foods/:id -> Delete a food item
router.delete('/:id', deleteFood);

export default router;