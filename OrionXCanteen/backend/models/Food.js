import pool from '../config/db.js';

class Food {
    static async getMealTypesByDate(date) {
        const [rows] = await pool.execute(
            `SELECT DISTINCT meal_type FROM daily_food WHERE meal_date = ?`,
            [date]
        );
        return rows.map(row => row.meal_type);
    }

    /**
     * Gets all available menu items for today and the future.
     * This query now correctly joins 'daily_food' with its components.
     * @returns {Promise<object>} - An object containing dailyFoods and standardFoods.
     */
    static async getTodaysMenu() {
        const today = new Date().toISOString().split('T')[0];

        // Query 1: Get daily meal packages scheduled for today or later, including images
        const [dailyFoods] = await pool.execute(
            `SELECT 
                df.d_id, 
                df.d_name, 
                df.meal_type, 
                df.meal_price,
                df.image_path,
                GROUP_CONCAT(dfc.dfc_name SEPARATOR ', ') as components
             FROM 
                daily_food df
             LEFT JOIN 
                daily_food_daily_component dfdc ON df.d_id = dfdc.d_id
             LEFT JOIN 
                daily_food_component dfc ON dfdc.dfc_id = dfc.dfc_id
             WHERE 
                df.meal_date >= ?
             GROUP BY
                df.d_id
             ORDER BY 
                df.meal_date ASC`,
            [today]
        );

        // Query 2: Get standard food items from the 'food' table, including images
        const [standardFoods] = await pool.execute(
            `SELECT 
                f.f_id, 
                f.f_name, 
                f.price, 
                f.image_path,
                c.c_name 
             FROM food f
             LEFT JOIN category c ON f.c_id = c.c_id
             WHERE f.stock > 0 AND f.expire_date >= ?`,
            [today]
        );

        return { dailyFoods, standardFoods };
    }
}

export default Food;
