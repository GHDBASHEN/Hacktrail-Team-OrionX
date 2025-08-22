import * as FoodModel from '../../models/admin/foodModel.js';

export const createFood = async (req, res) => {
    try {
        // Basic validation
        const { food_name, price, meal_type } = req.body;
        if (!food_name || !price || !meal_type) {
            return res.status(400).json({ message: "Food name, price, and meal type are required." });
        }
        const newFood = await FoodModel.create(req.body);
        res.status(201).json({ message: "Food item created successfully!", food: newFood });
    } catch (error) {
        res.status(500).json({ message: "Failed to create food item." });
    }
};

export const getAllFoods = async (req, res) => {
    try {
        const foods = await FoodModel.findAll();
        res.status(200).json(foods);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve food items." });
    }
};

export const updateFood = async (req, res) => {
    try {
        const success = await FoodModel.update(req.params.id, req.body);
        if (success) {
            res.status(200).json({ message: "Food item updated successfully." });
        } else {
            res.status(404).json({ message: "Food item not found." });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to update food item." });
    }
};

export const deleteFood = async (req, res) => {
    try {
        const success = await FoodModel.remove(req.params.id);
        if (success) {
            res.status(200).json({ message: "Food item deleted successfully." });
        } else {
            res.status(404).json({ message: "Food item not found." });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to delete food item." });
    }
};