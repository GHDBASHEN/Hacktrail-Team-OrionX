import db from '../../config/db.js';

// Create a new daily food item (no changes needed here, but included for completeness)
export const create = async (dailyFoodData) => {
    const { d_name, meal_type, meal_date, meal_price, c_id, components } = dailyFoodData;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        await connection.execute(
            'INSERT INTO daily_food (d_name, meal_type, meal_date, meal_price, c_id) VALUES (?, ?, ?, ?, ?)',
            [d_name, meal_type, meal_date, meal_price, c_id]
        );
        const [[{ d_id }]] = await connection.execute(
            'SELECT d_id FROM daily_food WHERE d_name = ? AND meal_date = ? AND meal_price = ? ORDER BY d_id DESC LIMIT 1',
            [d_name, meal_date, meal_price]
        );
        if (components && components.length > 0) {
            const componentPromises = components.map(dfc_id =>
                connection.execute('INSERT INTO daily_food_daily_component (d_id, dfc_id) VALUES (?, ?)', [d_id, dfc_id])
            );
            await Promise.all(componentPromises);
        }
        await connection.commit();
        return { id: d_id, ...dailyFoodData };
    } catch (error) {
        await connection.rollback();
        console.error("Error in create dailyFoodModel:", error);
        throw error;
    } finally {
        connection.release();
    }
};

// UPDATED: Find all daily food items and their components
export const findAll = async () => {
    const [rows] = await db.execute(`
        SELECT 
            df.d_id, df.d_name, df.meal_type, df.meal_date, df.meal_price, df.c_id,
            c.c_name,
            GROUP_CONCAT(dfc.dfc_name ORDER BY dfc.dfc_name SEPARATOR ', ') as component_names,
            GROUP_CONCAT(dfc.dfc_id) as component_ids
        FROM 
            daily_food df
        LEFT JOIN 
            category c ON df.c_id = c.c_id
        LEFT JOIN 
            daily_food_daily_component dfdc ON df.d_id = dfdc.d_id
        LEFT JOIN 
            daily_food_component dfc ON dfdc.dfc_id = dfc.dfc_id
        GROUP BY 
            df.d_id
        ORDER BY 
            df.meal_date DESC, df.d_name ASC
    `);
    return rows;
};

// Find a daily food item by its ID (no changes needed)
export const findById = async (dailyFoodId) => {
    const [rows] = await db.execute('SELECT * FROM daily_food WHERE d_id = ?', [dailyFoodId]);
    return rows[0];
};

// UPDATED: Update a daily food item and its components
export const update = async (dailyFoodId, dailyFoodData) => {
    const { d_name, meal_type, meal_date, meal_price, c_id, components } = dailyFoodData;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Update the main food details
        await connection.execute(
            'UPDATE daily_food SET d_name = ?, meal_type = ?, meal_date = ?, meal_price = ?, c_id = ? WHERE d_id = ?',
            [d_name, meal_type, meal_date, meal_price, c_id, dailyFoodId]
        );

        // Remove old components and add new ones
        await connection.execute('DELETE FROM daily_food_daily_component WHERE d_id = ?', [dailyFoodId]);
        if (components && components.length > 0) {
            const componentPromises = components.map(dfc_id => {
                return connection.execute(
                    'INSERT INTO daily_food_daily_component (d_id, dfc_id) VALUES (?, ?)',
                    [dailyFoodId, dfc_id]
                );
            });
            await Promise.all(componentPromises);
        }

        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        console.error("Error in update dailyFoodModel:", error);
        throw error;
    } finally {
        connection.release();
    }
};


// Delete a daily food item (no changes needed)
export const remove = async (dailyFoodId) => {
    const connection = await db.getConnection();
    try {
        // Start a transaction
        await connection.beginTransaction();

        // Step 1: Delete the associations from the junction table first
        await connection.execute(
            'DELETE FROM daily_food_daily_component WHERE d_id = ?',
            [dailyFoodId]
        );

        // Step 2: Delete the main daily_food item
        const [result] = await connection.execute(
            'DELETE FROM daily_food WHERE d_id = ?',
            [dailyFoodId]
        );

        // If both operations were successful, commit the transaction
        await connection.commit();

        return result.affectedRows > 0;
    } catch (error) {
        // If any error occurs, roll back the entire transaction
        await connection.rollback();
        console.error("Error in remove dailyFoodModel:", error);
        throw error; // Re-throw the error to be handled by the controller
    } finally {
        // Always release the connection back to the pool
        connection.release();
    }
};
