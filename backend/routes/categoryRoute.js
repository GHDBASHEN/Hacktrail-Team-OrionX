import express from 'express';
import {createCategory,getAllCategories,updateCategory,deleteCategory} from '../controllers/admin/categoryController.js';


const router = express.Router();

// POST /api/categories -> Create a new category
router.post('/', createCategory);

// GET /api/categories -> Get all categories
router.get('/', getAllCategories);

// PUT /api/categories/:id -> Update a category
router.put('/:id', updateCategory);

// DELETE /api/categories/:id -> Delete a category
router.delete('/:id', deleteCategory);

export default router;