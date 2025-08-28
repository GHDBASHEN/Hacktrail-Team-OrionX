import * as FoodModel from '../../models/admin/foodModel.js';
import Food from '../../models/Food.js';

export const createFood = async (req, res) => {
    try {
        const { f_name, price, stock, expire_date, c_id } = req.body;
        if (!f_name || !price || !stock || !expire_date || !c_id) {
            return res.status(400).json({ message: "All fields are required: name, price, stock, expiry date, and category." });
        }
        const newFood = await FoodModel.create(req.body);
        res.status(201).json({ message: "Food item created successfully!", food: newFood });
    } catch (error) {
        console.error("Error creating food:", error);
        res.status(500).json({ message: "Failed to create food item." });
    }
};

export const getAllFoods = async (req, res) => {
    try {
        const foods = await FoodModel.findAll();
        res.status(200).json(foods);
    } catch (error) {
        console.error("Error fetching foods:", error);
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
        console.error("Error updating food:", error);
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
        console.error("Error deleting food:", error);
        // Handle cases where the item might be in an order (a different constraint)
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             return res.status(400).json({ message: "Cannot delete this food as it is part of an existing order." });
        }
        res.status(500).json({ message: "Failed to delete food item." });
    }
};



/////////////////////////////////////////////////
export const getMealAvailability = async (req, res) => {
    try {
        const date = req.query.date || new Date().toISOString().split('T')[0];
        
        const availableMealTypes = await Food.getMealTypesByDate(date);
        
        const availability = {
            breakfast: availableMealTypes.includes('breakfast'),
            lunch: availableMealTypes.includes('lunch'),
            dinner: availableMealTypes.includes('dinner')
        };
        
        res.status(200).json({
            success: true,
            data: {
                date: date,
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

// Controller to get today's menu
export const getTodaysMenu = async (req, res) => {
    try {
        const menu = await Food.getTodaysMenu();
        
        // Combine daily and standard foods into a single array for the frontend
        const allItems = [
            ...menu.dailyFoods.map(item => ({
                food_id: item.d_id,
                food_name: item.d_name,
                price: item.meal_price,
                meal_type: item.meal_type,
                components: item.components,
                is_available: true, // Assuming if it's fetched, it's available
            })),
            ...menu.standardFoods.map(item => ({
                food_id: item.f_id,
                food_name: item.f_name,
                price: item.price,
                meal_type: 'any', // Standard items don't have a specific meal type
                components: null,
                is_available: true,
            }))
        ];
        
        res.status(200).json({
            success: true,
            data: allItems // This now sends a single, combined array
        });
    } catch (error) {
        console.error("Error fetching today's menu:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch today's menu",
            error: error.message
        });
    }
};
