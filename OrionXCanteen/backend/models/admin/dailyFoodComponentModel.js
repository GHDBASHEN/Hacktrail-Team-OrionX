import db from '../../config/db.js';

// Create a new daily food component
export const create = async (componentData) => {
    const { dfc_name, dfc_price } = componentData;
    // The trigger will auto-generate the dfc_id
    const [result] = await db.execute(
        'INSERT INTO daily_food_component (dfc_name, dfc_price) VALUES (?, ?)',
        [dfc_name, dfc_price]
    );
    return { id: result.insertId, ...componentData };
};

// Find all daily food components
export const findAll = async () => {
    const [rows] = await db.execute('SELECT * FROM daily_food_component ORDER BY dfc_name');
    return rows;
};

// Find a component by its ID
export const findById = async (componentId) => {
    const [rows] = await db.execute('SELECT * FROM daily_food_component WHERE dfc_id = ?', [componentId]);
    return rows[0];
};

// Update a daily food component
export const update = async (componentId, componentData) => {
    const { dfc_name, dfc_price } = componentData;
    const [result] = await db.execute(
        'UPDATE daily_food_component SET dfc_name = ?, dfc_price = ? WHERE dfc_id = ?',
        [dfc_name, dfc_price, componentId]
    );
    return result.affectedRows > 0;
};

// Delete a daily food component
export const remove = async (componentId) => {
    const [result] = await db.execute('DELETE FROM daily_food_component WHERE dfc_id = ?', [componentId]);
    return result.affectedRows > 0;
};
