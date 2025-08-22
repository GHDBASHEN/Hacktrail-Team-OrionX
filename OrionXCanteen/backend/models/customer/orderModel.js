
import db from '../../config/db.js';
import { v4 as uuidv4 } from 'uuid';

// CREATE a new order
export const create = async (customerId, items, specialNotes) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // Step 1: Get the official prices for all food items from the database
        const foodIds = items.map(item => item.food_id);
        if (foodIds.length === 0) {
            throw new Error("Cannot create an order with no items.");
        }
        
        const priceQuery = "SELECT food_id, price FROM foods WHERE food_id IN (?)";
        const [priceRows] = await connection.query(priceQuery, [foodIds]);

        // Create a map for easy and fast price lookup (e.g., 'FOOD000001' -> 250.00)
        const priceMap = new Map(priceRows.map(row => [row.food_id, parseFloat(row.price)]));

        // Step 2: Calculate total price and prepare items using the SECURE prices from the database
        let totalPrice = 0;
        const itemsWithSecurePrices = items.map(item => {
            const securePrice = priceMap.get(item.food_id);
            if (securePrice === undefined) {
                // This handles cases where a food_id from the cart doesn't exist in the DB
                throw new Error(`Invalid or unavailable food item provided: ${item.food_id}`);
            }
            totalPrice += securePrice * item.quantity;
            return {
                ...item,
                price_per_item: securePrice // Use the price from the database, not the request
            };
        });

        // Step 3: Insert the main order record with the securely calculated total price
        const token = uuidv4();
        await connection.execute(
            'INSERT INTO orders (customer_id, total_price, token, special_notes) VALUES (?, ?, ?, ?)',
            [customerId, totalPrice, token, specialNotes]
        );

        // Step 4: Retrieve the 'order_id' that the trigger just generated for this customer
        const [[{ order_id }]] = await connection.execute(
            'SELECT order_id FROM orders WHERE customer_id = ? ORDER BY order_time DESC LIMIT 1',
            [customerId]
        );

        // Step 5: Insert each item with its secure price into the 'order_items' table
        const orderItemsPromises = itemsWithSecurePrices.map(item => {
            return connection.execute(
                'INSERT INTO order_items (order_id, food_id, quantity, price_per_item) VALUES (?, ?, ?, ?)',
                [order_id, item.food_id, item.quantity, item.price_per_item] // Use the secure price
            );
        });
        await Promise.all(orderItemsPromises);

        await connection.commit();
        return { success: true, orderId: order_id, token: token };

    } catch (error) {
        await connection.rollback();
        console.error("Error in OrderModel.create:", error);
        throw error;
    } finally {
        connection.release();
    }
};

// READ a single order by its ID
export const findById = async (orderId) => {
    const [rows] = await db.execute(
        `SELECT o.order_id, o.order_time, o.total_price, o.order_status, o.special_notes, c.name as customer_name
         FROM orders o
         JOIN customers c ON o.customer_id = c.id
         WHERE o.order_id = ?`,
        [orderId]
    );
    if (rows.length === 0) return null;

    const [items] = await db.execute(
        `SELECT oi.quantity, oi.price_per_item, f.food_name
         FROM order_items oi
         JOIN foods f ON oi.food_id = f.food_id
         WHERE oi.order_id = ?`,
        [orderId]
    );
    
    rows[0].items = items;
    return rows[0];
};

// READ all orders for a specific customer
export const findAllByCustomer = async (customerId) => {
    const [orders] = await db.execute(
        'SELECT order_id, order_time, total_price, order_status FROM orders WHERE customer_id = ? ORDER BY order_time DESC',
        [customerId]
    );
    return orders;
};

// READ all orders (for admin)
export const findAll = async () => {
    const [orders] = await db.execute(
        `SELECT o.order_id, o.order_time, o.total_price, o.order_status, c.name as customer_name
         FROM orders o
         JOIN customers c ON o.customer_id = c.id
         ORDER BY o.order_time DESC`
    );
    return orders;
};

// UPDATE an order's status (for admin)
export const updateStatus = async (orderId, status) => {
    const [result] = await db.execute(
        'UPDATE orders SET order_status = ? WHERE order_id = ?',
        [status, orderId]
    );
    return result.affectedRows > 0;
};

// CANCEL an order (for student)
export const cancel = async (orderId, customerId) => {
    // Ensure only the owner can cancel, and only if the order is still 'Pending'
    const [result] = await db.execute(
        "UPDATE orders SET order_status = 'Cancelled' WHERE order_id = ? AND customer_id = ? AND order_status = 'Pending'",
        [orderId, customerId]
    );
    return result.affectedRows > 0;
};