import * as FoodModel from '../../models/admin/foodModel.js';
import Food from '../../models/Food.js';

export const createFood = async (req, res) => {
    try {
        // Basic validation
        const { food_name, price, meal_type } = req.body;
        console.log(req.body);
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


/////////////////////////////////////////////////
// Get today's menu
export const getTodaysMenu = async (req, res) => {
  try {
    const { meal_type } = req.query;
    const menu = await Food.getTodaysMenu(meal_type);
    
    res.status(200).json({
      success: true,
      data: menu
    });
  } catch (error) {
    console.error('Error fetching today\'s menu:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch today\'s menu',
      error: error.message
    });
  }
};

// Get meal availability for a date
export const getMealAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const mealTypes = await Food.getMealTypesByDate(targetDate);
    
    // Check which meal types are available
    const availability = {
      breakfast: mealTypes.includes('breakfast'),
      lunch: mealTypes.includes('lunch'),
      dinner: mealTypes.includes('dinner')
    };
    
    res.status(200).json({
      success: true,
      data: {
        date: targetDate,
        availability
      }
    });
  } catch (error) {
    console.error('Error checking meal availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check meal availability',
      error: error.message
    });
  }
};