
// import express from 'express';
// import { createFood, getAllFoods, updateFood, deleteFood } from '../controllers/admin/foodController.js';

// const router = express.Router();


// // POST /api/foods -> Create a new food item
// router.post('/', createFood);

// // GET /api/foods -> Get all food items
// router.get('/', getAllFoods);

// // PUT /api/foods/:id -> Update a food item
// router.put('/:id', updateFood);

// // DELETE /api/foods/:id -> Delete a food item
// router.delete('/:id', deleteFood);



// export default router;

import express from 'express';
import { 
  createFood, 
  getAllFoods, 
  updateFood, 
  deleteFood, 
  getTodaysMenu,
  getMealAvailability 
} from '../controllers/admin/foodController.js';

const router = express.Router();

// POST /api/foods -> Create a new food item
router.post('/', createFood);

// GET /api/foods -> Get all food items (with optional query params: date, meal_type, available)
router.get('/', getAllFoods);

// PUT /api/foods/:id -> Update a food item
router.put('/:id', updateFood);

// DELETE /api/foods/:id -> Delete a food item
router.delete('/:id', deleteFood);

// GET /api/foods/today/menu -> Get today's menu (optional query param: meal_type)
router.get('/today/menu', getTodaysMenu);

// GET /api/foods/availability -> Get meal availability for a date (optional query param: date)
router.get('/availability', getMealAvailability);

export default router;