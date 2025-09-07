import * as ComponentModel from '../../models/admin/dailyFoodComponentModel.js';

export const createComponent = async (req, res) => {
    try {
        const newComponent = await ComponentModel.create(req.body);
        res.status(201).json({ message: "Component created successfully!", component: newComponent });
    } catch (error) {
        res.status(500).json({ message: "Failed to create component.", error: error.message });
    }
};

export const getAllComponents = async (req, res) => {
    try {
        const components = await ComponentModel.findAll();
        res.status(200).json(components);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve components.", error: error.message });
    }
};

export const updateComponent = async (req, res) => {
    try {
        const success = await ComponentModel.update(req.params.id, req.body);
        if (success) {
            res.status(200).json({ message: "Component updated successfully." });
        } else {
            res.status(404).json({ message: "Component not found." });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to update component.", error: error.message });
    }
};

export const deleteComponent = async (req, res) => {
    try {
        const success = await ComponentModel.remove(req.params.id);
        if (success) {
            res.status(200).json({ message: "Component deleted successfully." });
        } else {
            res.status(404).json({ message: "Component not found." });
        }
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: "Cannot delete this component as it is part of a daily food item." });
        }
        res.status(500).json({ message: "Failed to delete component.", error: error.message });
    }
};
