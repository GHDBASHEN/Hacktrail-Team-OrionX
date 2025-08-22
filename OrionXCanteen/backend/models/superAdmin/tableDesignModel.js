import db from '../../config/db.js';

class TableDesign {
    static async getAllDesigns() {
        let connection;
        try {
            connection = await db.getConnection();
            const [designs] = await connection.query('SELECT my_row_id, Top_Cloth_Color, Table_Cloth_Color, Bow_Color, Chair_Cover_Color FROM tables_and_chairs');
            return designs;
        } catch (error) {
            console.error('Error fetching table designs:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async getDesignById(id) {
        let connection;
        try {
            connection = await db.getConnection();
            const [design] = await connection.query(
                'SELECT * FROM tables_and_chairs WHERE my_row_id = ?',
                [id]
            );
            if (design.length === 0) {
                throw new Error(`Design not found: ${id}`);
            }
            return design[0];
        } catch (error) {
            console.error('Error fetching design by ID:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async createDesign(designData) {
        let connection;
        try {
            connection = await db.getConnection();
            const [result] = await connection.query(
                'INSERT INTO tables_and_chairs (Top_Cloth_Color, Table_Cloth_Color, Bow_Color, Chair_Cover_Color) VALUES (?, ?, ?, ?)',
                [
                    designData.Top_Cloth_Color,
                    designData.Table_Cloth_Color,
                    designData.Bow_Color,
                    designData.Chair_Cover_Color
                ]
            );
            return { id: result.insertId, ...designData };
        } catch (error) {
            console.error('Error creating design:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async updateDesign(id, designData) {
        let connection;
        try {
            connection = await db.getConnection();
            const [result] = await connection.query(
                `UPDATE tables_and_chairs 
                SET Top_Cloth_Color = ?, 
                    Table_Cloth_Color = ?, 
                    Bow_Color = ?, 
                    Chair_Cover_Color = ? 
                WHERE my_row_id = ?`,
                [
                    designData.Top_Cloth_Color,
                    designData.Table_Cloth_Color,
                    designData.Bow_Color,
                    designData.Chair_Cover_Color,
                    id
                ]
            );
            if (result.affectedRows === 0) {
                throw new Error(`Design not found: ${id}`);
            }
            return { id, ...designData };
        } catch (error) {
            console.error('Error updating design:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async deleteDesign(id) {
        let connection;
        try {
            connection = await db.getConnection();
            console.log('Deleting design with ID:', id);
            const [result] = await connection.query(
                'DELETE FROM tables_and_chairs WHERE my_row_id = ?',
                [id]
            );
            if (result.affectedRows === 0) {
                throw new Error(`Design not found: ${id}`);
            }
            return { message: 'Design deleted successfully' };
        } catch (error) {
            console.error('Error deleting design:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
}

export default TableDesign;