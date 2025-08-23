import * as MenuModel from '../../models/customer/menuModel.js';


export const getDailyMenu = async (req, res) => {
    try {
        const menu = await MenuModel.findTodaysMenu();
        res.status(200).json(menu);
    } catch (error) {
        console.error("GET DAILY MENU FAILED:", error);
        res.status(500).json({ message: "Failed to retrieve the daily menu." });
    }
};