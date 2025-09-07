import db from '../../config/db.js';

export const create = async (categoryName) => {
    // The trigger will auto-generate the category_id
    const [result] = await db.execute('INSERT INTO category (c_name) VALUES (?)', [categoryName]);
    return { id: result.insertId, categoryName }; // It's useful to return the created object
};

export const findAll = async () => {
    const [rows] = await db.execute('SELECT * FROM category ORDER BY c_name');
    return rows;
};

export const findById = async (categoryId) => {
    const [rows] = await db.execute('SELECT * FROM category WHERE c_id = ?', [categoryId]);
    return rows[0];
};

export const update = async (categoryId, categoryName) => {
    const [result] = await db.execute('UPDATE category SET c_name = ? WHERE c_id = ?', [categoryName, categoryId]);
    return result.affectedRows > 0;
};

export const remove = async (categoryId) => {
    const [result] = await db.execute('DELETE FROM category WHERE c_id = ?', [categoryId]);
    return result.affectedRows > 0;
};