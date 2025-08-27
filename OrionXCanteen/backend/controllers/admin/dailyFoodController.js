import * as DailyFoodModel from '../../models/admin/dailyFoodModel.js';

export const createDailyFood = async (req, res) => {
    try {
        const newDailyFood = await DailyFoodModel.create(req.body);
        res.status(201).json({ message: "Daily food created successfully!", dailyFood: newDailyFood });
    } catch (error) {
        res.status(500).json({ message: "Failed to create daily food.", error: error.message });
    }
};

export const getAllDailyFoods = async (req, res) => {
    try {
        const dailyFoods = await DailyFoodModel.findAll();
        res.status(200).json(dailyFoods);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve daily foods.", error: error.message });
    }
};

export const updateDailyFood = async (req, res) => {
    try {
        const success = await DailyFoodModel.update(req.params.id, req.body);
        if (success) {
            res.status(200).json({ message: "Daily food updated successfully." });
        } else {
            res.status(404).json({ message: "Daily food not found." });
        }
    } catch (error) {
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
