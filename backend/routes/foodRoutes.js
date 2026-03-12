
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
import upload from '../middleware/upload.js';
import { userRole } from '../middleware/userRole.js';

const router = express.Router();

// POST /api/foods -> Create a new food item (employee/sub_admin/super_admin only)
router.post('/', userRole, upload.single('image'), createFood);

// GET /api/foods -> Get all food items (open)
router.get('/', getAllFoods);

// PUT /api/foods/:id -> Update a food item (employee/sub_admin/super_admin only)
router.put('/:id', userRole, upload.single('image'), updateFood);

// DELETE /api/foods/:id -> Delete a food item (employee/sub_admin/super_admin only)
router.delete('/:id', userRole, deleteFood);

// GET /api/foods/today/menu -> Get today's menu (optional query param: meal_type)
router.get('/today/menu', getTodaysMenu);

// GET /api/foods/availability -> Get meal availability for a date (optional query param: date)
router.get('/availability', getMealAvailability);

export default router;