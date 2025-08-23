import db from '../../config/db.js';

export const findTodaysMenu = async () => {
    // This query joins foods with their daily components for today's date
    const query = `
        SELECT
            f.food_id,
            f.food_name,
            f.price,
            f.meal_type,
            f.image_url,
            c.category_name,
            GROUP_CONCAT(fc.component_name SEPARATOR ', ') AS components
        FROM
            foods AS f
        JOIN
            daily_menu_items AS dmi ON f.food_id = dmi.food_id
        JOIN
            food_components AS fc ON dmi.component_id = fc.component_id
        LEFT JOIN
            categories AS c ON f.category_id = c.category_id
        WHERE
            dmi.available_date = CURDATE() AND f.is_available = 1
        GROUP BY
            f.food_id, f.food_name, f.price, f.meal_type, f.image_url, c.category_name
        ORDER BY
            f.meal_type, f.food_name;
    `;
    const [rows] = await db.promise().query(query);
    return rows;
};