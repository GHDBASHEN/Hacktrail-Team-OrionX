import pool from '../config/db.js';

class Food {
  // Create a new food item
  static async create(foodData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Insert food
      const [foodResult] = await connection.execute(
        `INSERT INTO foods (food_id, food_name, category_id, price, available_date, meal_type, is_available, image_url) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [foodData.food_id, foodData.food_name, foodData.category_id, foodData.price, 
         foodData.available_date, foodData.meal_type, foodData.is_available, foodData.image_url]
      );
      
      // Insert components if provided
      if (foodData.components && foodData.components.length > 0) {
        for (const component_id of foodData.components) {
          await connection.execute(
            `INSERT INTO daily_menu_items (food_id, component_id, available_date) 
             VALUES (?, ?, ?)`,
            [foodData.food_id, component_id, foodData.available_date]
          );
        }
      }
      
      await connection.commit();
      return foodResult;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get all food items with optional filters
  static async findAll(filters = {}) {
    let query = `
      SELECT f.*, 
             GROUP_CONCAT(DISTINCT fc.component_name SEPARATOR ', ') as components,
             GROUP_CONCAT(DISTINCT fc.component_id SEPARATOR ', ') as component_ids
      FROM foods f
      LEFT JOIN daily_menu_items dmi ON f.food_id = dmi.food_id 
      LEFT JOIN food_components fc ON dmi.component_id = fc.component_id
    `;
    
    const conditions = [];
    const params = [];
    
    if (filters.available_date) {
      conditions.push('f.available_date = ?');
      params.push(filters.available_date);
    }
    
    if (filters.meal_type) {
      conditions.push('f.meal_type = ?');
      params.push(filters.meal_type);
    }
    
    if (filters.is_available !== undefined) {
      conditions.push('f.is_available = ?');
      params.push(filters.is_available);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' GROUP BY f.food_id ORDER BY f.available_date DESC, f.meal_type';
    
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  // Find food by ID
  static async findById(food_id) {
    const [rows] = await pool.execute(
      `SELECT f.*, 
              GROUP_CONCAT(DISTINCT fc.component_id SEPARATOR ', ') as component_ids,
              GROUP_CONCAT(DISTINCT fc.component_name SEPARATOR ', ') as components
       FROM foods f
       LEFT JOIN daily_menu_items dmi ON f.food_id = dmi.food_id 
       LEFT JOIN food_components fc ON dmi.component_id = fc.component_id
       WHERE f.food_id = ?
       GROUP BY f.food_id`,
      [food_id]
    );
    return rows[0];
  }

  // Update a food item
  static async update(food_id, foodData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Update food
      const [result] = await connection.execute(
        `UPDATE foods 
         SET food_name = ?, category_id = ?, price = ?, available_date = ?, 
             meal_type = ?, is_available = ?, image_url = ?
         WHERE food_id = ?`,
        [foodData.food_name, foodData.category_id, foodData.price, 
         foodData.available_date, foodData.meal_type, foodData.is_available, 
         foodData.image_url, food_id]
      );
      
      // Delete existing components
      await connection.execute(
        'DELETE FROM daily_menu_items WHERE food_id = ?',
        [food_id]
      );
      
      // Insert new components if provided
      if (foodData.components && foodData.components.length > 0) {
        for (const component_id of foodData.components) {
          await connection.execute(
            `INSERT INTO daily_menu_items (food_id, component_id, available_date) 
             VALUES (?, ?, ?)`,
            [food_id, component_id, foodData.available_date]
          );
        }
      }
      
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Delete a food item
  static async delete(food_id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Delete from daily_menu_items first
      await connection.execute(
        'DELETE FROM daily_menu_items WHERE food_id = ?',
        [food_id]
      );
      
      // Delete from foods
      const [result] = await connection.execute(
        'DELETE FROM foods WHERE food_id = ?',
        [food_id]
      );
      
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get available meal types for a date
  static async getMealTypesByDate(date) {
    const [rows] = await pool.execute(
      `SELECT DISTINCT meal_type 
       FROM foods 
       WHERE available_date = ? AND is_available = 1`,
      [date]
    );
    return rows.map(row => row.meal_type);
  }

  // Get today's menu by meal type
  static async getTodaysMenu(meal_type = null) {
    const today = new Date().toISOString().split('T')[0];
    let query = `
      SELECT f.*, 
             GROUP_CONCAT(DISTINCT fc.component_name SEPARATOR ', ') as components
      FROM foods f
      LEFT JOIN daily_menu_items dmi ON f.food_id = dmi.food_id 
      LEFT JOIN food_components fc ON dmi.component_id = fc.component_id
      WHERE f.available_date = ? AND f.is_available = 1
    `;
    
    const params = [today];
    
    if (meal_type) {
      query += ' AND f.meal_type = ?';
      params.push(meal_type);
    }
    
    query += ' GROUP BY f.food_id ORDER BY f.meal_type, f.food_name';
    
    const [rows] = await pool.execute(query, params);
    return rows;
  }
}

export default Food;