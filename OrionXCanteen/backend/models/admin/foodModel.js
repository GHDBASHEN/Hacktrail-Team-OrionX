import db from '../../config/db.js';

// Create a new food item
export const create = async (foodData) => {
    const { f_name, price, stock, expire_date, c_id } = foodData;
    // The trigger will auto-generate the f_id
    const [result] = await db.execute(
        'INSERT INTO food (f_name, price, stock, expire_date, c_id) VALUES (?, ?, ?, ?, ?)',
        [f_name, price, stock, expire_date, c_id]
    );
    return { id: result.insertId, ...foodData };
};

// Find all food items
export const findAll = async () => {
    const [rows] = await db.execute(`
        SELECT f.f_id, f.f_name, f.price, f.stock, f.expire_date, c.c_name 
        FROM food f
        LEFT JOIN category c ON f.c_id = c.c_id
        ORDER BY f.f_name
    `);
    return rows;
};

// Find a food item by its ID
export const findById = async (foodId) => {
    const [rows] = await db.execute('SELECT * FROM food WHERE f_id = ?', [foodId]);
    return rows[0];
};

// Update a food item
export const update = async (foodId, foodData) => {
    const { f_name, price, stock, expire_date, c_id } = foodData;
    const [result] = await db.execute(
        'UPDATE food SET f_name = ?, price = ?, stock = ?, expire_date = ?, c_id = ? WHERE f_id = ?',
        [f_name, price, stock, expire_date, c_id, foodId]
    );
    return result.affectedRows > 0;
};

// Delete a food item and its associations in carts
export const remove = async (foodId) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Step 1: Remove the food item from any carts it might be in
        await connection.execute(
            'DELETE FROM cart WHERE f_id = ?',
            [foodId]
        );

        // Step 2: Delete the food item itself
        const [result] = await connection.execute(
            'DELETE FROM food WHERE f_id = ?', 
            [foodId]
        );

        await connection.commit();
        return result.affectedRows > 0;
    } catch (error) {
        await connection.rollback();
        console.error("Error in remove foodModel:", error);
        throw error;
    } finally {
        connection.release();
    }
};
