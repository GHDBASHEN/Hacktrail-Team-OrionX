import db from '../../config/db.js';

export const create = async (dailyFoodData) => {
    const { d_name, meal_type, meal_date, meal_price, c_id, image_path } = dailyFoodData;
    // Ensure components is always an array, handling cases where it's a single value or undefined
    const components = Array.isArray(dailyFoodData.components) ? dailyFoodData.components : (dailyFoodData.components ? [dailyFoodData.components] : []);

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        
        // This query is missing the 'd_id', which is a primary key. See note below.
        await connection.execute(
            'INSERT INTO daily_food (d_name, meal_type, meal_date, meal_price, c_id, image_path) VALUES (?, ?, ?, ?, ?, ?)',
            [d_name, meal_type, meal_date, meal_price, c_id, image_path || null]
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
        // Return the generated ID along with the original data
        return { d_id, ...dailyFoodData };
    } catch (error) {
        await connection.rollback();
        console.error("Error in create dailyFoodModel:", error);
        throw error;
    } finally {
        connection.release();
    }
};

// Find all daily food items, their components, and images
export const findAll = async () => {
    const [rows] = await db.execute(`
        SELECT 
            df.d_id, df.d_name, df.meal_type, df.meal_date, df.meal_price, df.c_id, df.image_path,
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

// Find a daily food item by its ID
export const findById = async (dailyFoodId) => {
    const [rows] = await db.execute('SELECT * FROM daily_food WHERE d_id = ?', [dailyFoodId]);
    return rows[0];
};

// UPDATED: Dynamically update a daily food item to prevent errors
export const update = async (dailyFoodId, dailyFoodData) => {
    const { components, ...foodDetails } = dailyFoodData;
    // Sanitize components to ensure it is always an array for safe processing.
    const sanitizedComponents = Array.isArray(components) ? components : (components ? [components] : []);

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Dynamically build the update query to avoid 'undefined' errors
        // and only update fields that are actually provided.
        const fieldsToUpdate = [];
        const queryParams = [];

        Object.entries(foodDetails).forEach(([key, value]) => {
            if (value !== undefined) {
                fieldsToUpdate.push(`${key} = ?`);
                queryParams.push(value);
            }
        });

        if (fieldsToUpdate.length > 0) {
            queryParams.push(dailyFoodId);
            const updateQuery = `UPDATE daily_food SET ${fieldsToUpdate.join(', ')} WHERE d_id = ?`;
            await connection.execute(updateQuery, queryParams);
        }

        // Update components by deleting old and inserting new ones
        await connection.execute('DELETE FROM daily_food_daily_component WHERE d_id = ?', [dailyFoodId]);
        if (sanitizedComponents.length > 0) {
            const componentPromises = sanitizedComponents.map(dfc_id => {
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

// Delete a daily food item
export const remove = async (dailyFoodId) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        await connection.execute('DELETE FROM daily_food_daily_component WHERE d_id = ?', [dailyFoodId]);
        const [result] = await connection.execute('DELETE FROM daily_food WHERE d_id = ?', [dailyFoodId]);
        await connection.commit();
        return result.affectedRows > 0;
    } catch (error) {
        await connection.rollback();
        console.error("Error in remove dailyFoodModel:", error);
        throw error;
    } finally {
        connection.release();
    }
};

