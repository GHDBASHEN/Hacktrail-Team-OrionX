import db from '../../config/db.js';

// Get today's available daily foods and standard foods
export const getTodaysMenu = async () => {
    const today = new Date().toISOString().slice(0, 10); // Get YYYY-MM-DD format

    // CORRECTED QUERY: This now correctly joins and groups the component names for each meal
    const [dailyFoods] = await db.execute(
        `SELECT 
            df.d_id, df.d_name, df.meal_type, df.meal_price, df.c_id,
            GROUP_CONCAT(dfc.dfc_name SEPARATOR ', ') as component_names
         FROM 
            daily_food df
         LEFT JOIN 
            daily_food_daily_component dfdc ON df.d_id = dfdc.d_id
         LEFT JOIN 
            daily_food_component dfc ON dfdc.dfc_id = dfc.dfc_id
         WHERE 
            df.meal_date >= ?
         GROUP BY
            df.d_id
         ORDER BY 
            df.meal_date ASC`,
        [today]
    );

    // Fetch standard, available food items that haven't expired
    const [standardFoods] = await db.execute(
        `SELECT f_id, f_name, price, c_id FROM food WHERE stock > 0 AND expire_date >= ?`,
        [today]
    );

    return { dailyFoods, standardFoods };
};

// ... (The rest of your createOrder function remains the same)
export const createOrder = async (customerId, cartItems) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [cartResult] = await connection.execute(
            'INSERT INTO cart (cus_id) VALUES (?)',
            [customerId]
        );
        const tempCartId = cartResult.insertId; 

        const [[{ cart_id }]] = await connection.execute(
            'SELECT cart_id FROM cart WHERE id = ?', 
            [tempCartId]
        );
        
        let totalAmount = 0;

        for (const item of cartItems) {
            if (item.d_id) {
                await connection.execute(
                    'UPDATE cart SET d_id = ?, item_count = ? WHERE cart_id = ?',
                    [item.d_id, item.quantity, cart_id]
                );
                totalAmount += item.meal_price * item.quantity;
            } else if (item.f_id) {
                 await connection.execute(
                    'UPDATE cart SET f_id = ?, item_count = ? WHERE cart_id = ?',
                    [item.f_id, item.quantity, cart_id]
                );
                totalAmount += item.price * item.quantity;
            }
        }
        
        await connection.execute(
            'UPDATE cart SET total_amount = ? WHERE cart_id = ?',
            [totalAmount, cart_id]
        );

        const [orderResult] = await connection.execute(
            'INSERT INTO orders (total_amount, cart_id) VALUES (?, ?)',
            [totalAmount, cart_id]
        );
        const tempOrderId = orderResult.insertId;

        const [[{ order_id }]] = await connection.execute(
            'SELECT order_id FROM orders WHERE id = ?',
            [tempOrderId]
        );

        await connection.commit();
        
        return { order_id, total_amount: totalAmount };

    } catch (error) {
        await connection.rollback();
        console.error("Error in createOrder model:", error);
        throw error;
    } finally {
        connection.release();
    }
};
