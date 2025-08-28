// import * as MenuModel from '../../models/customer/menuModel.js';
// import Food from '../../models/Food.js';

// export const getDailyMenu = async (req, res) => {
//     try {
//         const menu = await MenuModel.findTodaysMenu();
//         res.status(200).json(menu);
//     } catch (error) {
//         console.error("GET DAILY MENU FAILED:", error);
//         res.status(500).json({ message: "Failed to retrieve the daily menu." });
//     }
// };





// // Controller to get meal availability for a specific date (defaults to today)
// export const getMealAvailability = async (req, res) => {
//     try {
//         const date = req.query.date || new Date().toISOString().split('T')[0];
        
//         const availableMealTypes = await Food.getMealTypesByDate(date);
        
//         const availability = {
//             breakfast: availableMealTypes.includes('breakfast'),
//             lunch: availableMealTypes.includes('lunch'),
//             dinner: availableMealTypes.includes('dinner')
//         };
        
//         res.status(200).json({
//             success: true,
//             data: {
//                 date: date,
//                 availability
//             }
//         });
//     } catch (error) {
//         console.error('Error checking meal availability:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to check meal availability',
//             error: error.message
//         });
//     }
// };

// // Controller to get today's menu, with an optional filter by meal_type
// export const getTodaysMenu = async (req, res) => {
//     try {
//         const { meal_type } = req.query; // e.g., /api/foods/today/menu?meal_type=lunch
//         const menu = await Food.getTodaysMenu(meal_type);
        
//         res.status(200).json({
//             success: true,
//             data: menu
//         });
//     } catch (error) {
//         console.error("Error fetching today's menu:", error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch today's menu",
//             error: error.message
//         });
//     }
// };
