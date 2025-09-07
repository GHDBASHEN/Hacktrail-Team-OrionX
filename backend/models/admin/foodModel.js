import db from '../../config/db.js';

// Create a new food item
export const create = async (foodData) => {
    const { f_name, price, stock, expire_date, c_id, image_path } = foodData;
    

    const [result] = await db.execute(
        'INSERT INTO food (f_name, price, stock, expire_date, c_id, image_path) VALUES (?, ?, ?, ?, ?, ?)',
        [f_name, price, stock, expire_date, c_id, image_path || null]
    );
    return {...foodData };
};

// Find all food items, now including the image path
export const findAll = async () => {
    const [rows] = await db.execute(`
        SELECT f.f_id, f.f_name, f.price, f.stock, f.expire_date, f.image_path, c.c_name, f.c_id 
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

// Update a food item, dynamically handling image updates
export const update = async (foodId, foodData) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const fieldsToUpdate = [];
        const queryParams = [];

        // Build the query dynamically based on the provided data
        Object.entries(foodData).forEach(([key, value]) => {
            // Only add fields that are provided and are valid columns in the 'food' table
            if (value !== undefined && ['f_name', 'price', 'stock', 'expire_date', 'c_id', 'image_path'].includes(key)) {
                fieldsToUpdate.push(`${key} = ?`);
                queryParams.push(value);
            }
        });

        if (fieldsToUpdate.length > 0) {
            queryParams.push(foodId);
            const updateQuery = `UPDATE food SET ${fieldsToUpdate.join(', ')} WHERE f_id = ?`;
            await connection.execute(updateQuery, queryParams);
        }

        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        console.error("Error in update foodModel:", error);
        throw error;
    } finally {
        connection.release();
    }
};

// Delete a food item and its associations in carts
export const remove = async (foodId) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        await connection.execute('DELETE FROM cart WHERE f_id = ?', [foodId]);
        const [result] = await connection.execute('DELETE FROM food WHERE f_id = ?', [foodId]);
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
