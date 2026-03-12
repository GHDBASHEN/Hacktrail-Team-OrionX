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

        let totalAmount = 0;
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

        for (const item of cartItems) {
            const price = item.d_id ? item.meal_price : item.price;
            totalAmount += price * item.quantity;
        }

        // 1. Insert into cart
        const [cartResult] = await connection.execute(
            'INSERT INTO cart (cus_id, total_amount, created_date) VALUES (?, ?, ?)',
            [customerId, totalAmount, now]
        );
        const cartId = cartResult.insertId;

        // 2. Update cart with items (Note: current schema only has one d_id/f_id per cart row)
        for (const item of cartItems) {
            if (item.d_id) {
                await connection.execute(
                    'UPDATE cart SET d_id = ?, item_count = ? WHERE cart_id = ?',
                    [item.d_id, item.quantity, cartId]
                );
            } else if (item.f_id) {
                await connection.execute(
                    'UPDATE cart SET f_id = ?, item_count = ? WHERE cart_id = ?',
                    [item.f_id, item.quantity, cartId]
                );
            }
        }

        // 3. Create order
        const [orderResult] = await connection.execute(
            'INSERT INTO orders (cus_id, total_amount, cart_id, status, order_date) VALUES (?, ?, ?, ?, ?)',
            [customerId, totalAmount, cartId, 'Pending', now]
        );
        const orderId = orderResult.insertId;

        // 4. Insert into order_items (required for triggers and record keeping)
        for (const item of cartItems) {
            if (item.d_id) {
                await connection.execute(
                    'INSERT INTO order_items (order_id, d_id, qty, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.d_id, item.quantity, item.meal_price]
                );
            }
            // Note: if standard food (item.f_id) needs tracking in order_items, 
            // the schema needs an f_id column in order_items.
        }

        await connection.commit();
        return { orderId: orderId, totalAmount: totalAmount };

    } catch (error) {
        await connection.rollback();
        console.error("Error in createOrder model:", error);
        throw error;
    } finally {
        connection.release();
    }
};



export const findOrdersByCustomerId = async (customerId) => {
    const [orders] = await db.execute(
        `SELECT 
            o.order_id,
            o.order_date,
            o.total_amount,
            o.status,
            o.payment_status,
            COALESCE(df.d_name, f.f_name) AS item_name,
            c.item_count
         FROM orders o
         JOIN cart c ON o.cart_id = c.cart_id
         LEFT JOIN daily_food df ON c.d_id = df.d_id
         LEFT JOIN food f ON c.f_id = f.f_id
         WHERE c.cus_id = ?
         ORDER BY o.order_date DESC`,
        [customerId]
    );
    return orders;
};


export const getAllOrders = async () => {
    const [rows] = await db.execute(`
        SELECT 
            o.order_id,
            o.order_date,
            o.total_amount,
            o.status,
            o.payment_status,
            c.cus_id,
            cust.name AS customer_name,
            cust.email AS customer_email,
            cust.phone AS customer_contact,
            COALESCE(f.f_name, df.d_name) AS item_name,
            c.item_count
        FROM orders o
        JOIN cart c ON o.cart_id = c.cart_id
        JOIN customers cust ON c.cus_id = cust.cus_id
        LEFT JOIN food f ON c.f_id = f.f_id
        LEFT JOIN daily_food df ON c.d_id = df.d_id
        ORDER BY o.order_date DESC
    `);
    return rows;
};

// Update the status of an order
export const updateOrderStatus = async (orderId, newStatus) => {
    const [result] = await db.execute(
        'UPDATE orders SET status = ? WHERE order_id = ?',
        [newStatus, orderId]
    );
    return result.affectedRows > 0;
};