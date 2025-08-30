import express from 'express';
import {
    createDailyFood,
    getAllDailyFoods,
    updateDailyFood,
    deleteDailyFood
} from '../controllers/admin/dailyFoodController.js';
import upload from '../middleware/upload.js'; // Import the upload middleware

const router = express.Router();

// Apply the 'upload' middleware to handle the 'image' file field on creation
router.post('/daily-foods', upload.single('image'), createDailyFood);

// GET route does not need the middleware
router.get('/daily-foods', getAllDailyFoods);

// Apply the 'upload' middleware to handle the 'image' file field on update
router.put('/daily-foods/:id', upload.single('image'), updateDailyFood);

// DELETE route does not need the middleware
router.delete('/daily-foods/:id', deleteDailyFood);

export default router;

