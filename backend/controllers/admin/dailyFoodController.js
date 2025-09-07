import * as DailyFoodModel from '../../models/admin/dailyFoodModel.js';

export const createDailyFood = async (req, res) => {
    try {
        const dailyFoodData = { ...req.body };
        if (req.file) {
            // Construct a clean, relative path using the filename from multer
            dailyFoodData.image_path = `uploads/${req.file.filename}`;
        }
        const newDailyFood = await DailyFoodModel.create(dailyFoodData);
        res.status(201).json({ message: "Daily food created successfully!", dailyFood: newDailyFood });
    } catch (error) {
        console.error("Error creating daily food:", error);
        res.status(500).json({ message: "Failed to create daily food.", error: error.message });
    }
};

export const getAllDailyFoods = async (req, res) => {
    try {
        const dailyFoods = await DailyFoodModel.findAll();
        res.status(200).json(dailyFoods);
    } catch (error) {
        console.error("Error fetching daily foods:", error);
        res.status(500).json({ message: "Failed to retrieve daily foods.", error: error.message });
    }
};


export const updateDailyFood = async (req, res) => {
    try {
        // Explicitly pull only the fields that should be updated from the request body.
        // This prevents extra data from the frontend (like c_name) causing errors.
        const { d_name, meal_type, meal_date, meal_price, c_id, components } = req.body;
        const dailyFoodData = { d_name, meal_type, meal_date, meal_price, c_id, components };

        if (req.file) {
            // If a new file is uploaded, construct a clean, relative path.
            dailyFoodData.image_path = `uploads/${req.file.filename}`;
        }

        const success = await DailyFoodModel.update(req.params.id, dailyFoodData);
        if (success) {
            res.status(200).json({ message: "Daily food updated successfully." });
        } else {
            res.status(404).json({ message: "Daily food not found or no changes made." });
        }
    } catch (error) {
        console.error("Error updating daily food:", error);
        res.status(500).json({ message: "Failed to update daily food.", error: error.message });
    }
};

export const deleteDailyFood = async (req, res) => {
    try {
        const success = await DailyFoodModel.remove(req.params.id);
        if (success) {
            res.status(200).json({ message: "Daily food deleted successfully." });
        } else {
            res.status(404).json({ message: "Daily food not found." });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to delete daily food.", error: error.message });
    }
};

