import express from 'express';
import { createDailyFood, getAllDailyFoods, updateDailyFood, deleteDailyFood } from '../controllers/admin/dailyFoodController.js';

const router = express.Router();

router.post('/daily-foods', createDailyFood);
router.get('/daily-foods', getAllDailyFoods);
router.put('/daily-foods/:id', updateDailyFood);
router.delete('/daily-foods/:id', deleteDailyFood);

export default router;
