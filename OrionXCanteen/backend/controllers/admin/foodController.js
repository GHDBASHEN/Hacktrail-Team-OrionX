import * as FoodModel from '../../models/admin/foodModel.js';
import Food from '../../models/Food.js';

export const createFood = async (req, res) => {
    try {
        const foodData = { ...req.body };
        if (req.file) {
            // Use the filename to create a relative path
            foodData.image_path = `uploads/${req.file.filename}`;
        }

        const newFood = await FoodModel.create(foodData);
        res.status(201).json({ message: "Food item created successfully!", food: newFood });
    } catch (error) {
        console.error("Error creating food:", error);
        res.status(500).json({ message: "Failed to create food item." });
    }
};

// Get all food items
export const getAllFoods = async (req, res) => {
    try {
        const foods = await FoodModel.findAll();
        res.status(200).json(foods);
    } catch (error) {
        console.error("Error fetching foods:", error);
        res.status(500).json({ message: "Failed to retrieve food items." });
    }
};

// Update an existing food item, handling file upload
export const updateFood = async (req, res) => {
    try {
        const foodData = { ...req.body };
        if (req.file) {
            // If a new file is uploaded, update the image path
            foodData.image_path = `uploads/${req.file.filename}`;
        }
        
        const success = await FoodModel.update(req.params.id, foodData);
        if (success) {
            res.status(200).json({ message: "Food item updated successfully." });
        } else {
            res.status(404).json({ message: "Food item not found or no changes made." });
        }
    } catch (error) {
        console.error("Error updating food:", error);
        res.status(500).json({ message: "Failed to update food item." });
    }
};

// Delete a food item
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
        // This model method should fetch both daily and standard foods for today.
        // It must select 'image_path' and 'c_name' for standard foods.
        const menu = await Food.getTodaysMenu(); 

        // Combine daily and standard foods, including the image_path and correct category name
        const allItems = [
            ...menu.dailyFoods.map(item => ({
                food_id: item.d_id,
                food_name: item.d_name,
                price: item.meal_price,
                meal_type: item.meal_type,
                components: item.components,
                image_path: item.image_path, // Pass the image path
                is_available: true, 
            })),
            ...menu.standardFoods.map(item => ({
                food_id: item.f_id,
                food_name: item.f_name,
                price: item.price,
                meal_type: item.c_name || 'General', // Use the category name instead of 'any'
                components: null,
                image_path: item.image_path, // Pass the image path
                is_available: true,
            }))
        ];
        
        res.status(200).json({
            success: true,
            data: allItems
        });

    } catch (error) {
        console.error("Error fetching today's menu:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve today's menu." });
    }
};
