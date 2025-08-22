import * as CategoryModel from '../../models/admin/categoryModel.js';

export const createCategory = async (req, res) => {
    try {
        const { category_name } = req.body;
        if (!category_name) {
            return res.status(400).json({ message: "Category name is required." });
        }
        const newCategory = await CategoryModel.create(category_name);
        res.status(201).json({ message: "Category created successfully!", category: newCategory });
    } catch (error) {
        res.status(500).json({ message: "Failed to create category." });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.findAll();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve categories." });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { category_name } = req.body;
        if (!category_name) {
            return res.status(400).json({ message: "Category name is required." });
        }
        const success = await CategoryModel.update(req.params.id, category_name);
        if (success) {
            res.status(200).json({ message: "Category updated successfully." });
        } else {
            res.status(404).json({ message: "Category not found." });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to update category." });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const success = await CategoryModel.remove(req.params.id);
        if (success) {
            res.status(200).json({ message: "Category deleted successfully." });
        } else {
            res.status(404).json({ message: "Category not found." });
        }
    } catch (error) {
        // Handle foreign key constraint error
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: "Cannot delete category as it is being used by food items." });
        }
        res.status(500).json({ message: "Failed to delete category." });
    }
};