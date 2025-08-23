import db from '../../config/db.js';

export const create = async (food) => {
    const { food_name, category_id, price, meal_type, is_available, image_url } = food;
    console.log("slsls", food_name, category_id, price, meal_type, is_available, image_url)
    // The trigger will auto-generate the food_id
    const [result] = await db.execute(
        'INSERT INTO foods (food_name, category_id, price, meal_type, is_available, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        [food_name, category_id, price, meal_type, is_available, image_url]
    );
    return { id: result.insertId, ...food };
};

export const findAll = async () => {
    const [rows] = await db.execute(`
        SELECT f.*, c.category_name 
        FROM foods f
        LEFT JOIN categories c ON f.category_id = c.category_id
        ORDER BY f.food_name
    `);
    return rows;
};

export const findById = async (foodId) => {
    const [rows] = await db.execute(
        'SELECT * FROM foods WHERE food_id = ?', [foodId]
    );
    return rows[0];
};

export const update = async (foodId, food) => {
    const { food_name, category_id, price, meal_type, is_available, image_url } = food;
    const [result] = await db.execute(
        'UPDATE foods SET food_name = ?, category_id = ?, price = ?, meal_type = ?, is_available = ?, image_url = ? WHERE food_id = ?',
        [food_name, category_id, price, meal_type, is_available, image_url, foodId]
    );
    return result.affectedRows > 0;
};

export const remove = async (foodId) => {
    const [result] = await db.execute('DELETE FROM foods WHERE food_id = ?', [foodId]);
    return result.affectedRows > 0;
};