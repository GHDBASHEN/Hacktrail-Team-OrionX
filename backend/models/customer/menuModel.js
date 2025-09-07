// backend/models/customer/menuModel.js

import db from '../../config/db.js';

export const findTodaysMenu = async () => {
    const today = new Date().toISOString().slice(0, 10);
    try {
        const query = `
            SELECT 
                f.food_id, 
                f.food_name, 
                f.price,
                GROUP_CONCAT(fc.component_name SEPARATOR ', ') AS components
            FROM 
                foods f
            JOIN 
                daily_menu_items dmi ON f.food_id = dmi.food_id
            JOIN 
                food_components fc ON dmi.component_id = fc.component_id
            WHERE 
                f.available_date = ?
            GROUP BY
                f.food_id;
        `;
        const [rows] = await db.query(query, [today]);
        return rows;
    } catch (error) {
        console.error('GET DAILY MENU FAILED:', error);
        throw error;
    }
};