import express from 'express';
import { createComponent, getAllComponents, updateComponent, deleteComponent } from '../controllers/admin/dailyFoodComponentController.js';

const router = express.Router();

router.post('/daily-food-components', createComponent);
router.get('/daily-food-components', getAllComponents);
router.put('/daily-food-components/:id', updateComponent);
router.delete('/daily-food-components/:id', deleteComponent);

export default router;