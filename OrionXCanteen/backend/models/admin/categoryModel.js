import db from '../../config/db.js';

export const create = async (categoryName) => {
    // The trigger will auto-generate the category_id
    const [result] = await db.execute('INSERT INTO category (category_name) VALUES (?)', [categoryName]);
    return { id: result.insertId, categoryName }; // It's useful to return the created object
};

export const findAll = async () => {
    const [rows] = await db.execute('SELECT * FROM category ORDER BY category_name');
    return rows;
};

export const findById = async (categoryId) => {
    const [rows] = await db.execute('SELECT * FROM category WHERE category_id = ?', [categoryId]);
    return rows[0];
};

export const update = async (categoryId, categoryName) => {
    const [result] = await db.execute('UPDATE category SET category_name = ? WHERE category_id = ?', [categoryName, categoryId]);
    return result.affectedRows > 0;
};

export const remove = async (categoryId) => {
    const [result] = await db.execute('DELETE FROM category WHERE category_id = ?', [categoryId]);
    return result.affectedRows > 0;
};