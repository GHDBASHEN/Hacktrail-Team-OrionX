import db from '../../config/db.js';

class CustomerEventService {
  static async getAll() {
    const query = `
      SELECT 
        ces.my_row_id,
        ces.customer_id,
        c.name AS customer_name,
        c.email AS customer_email,
        ces.event_service_id,
        es.Event_Service_Name AS service_name,
        es.image_path,
        ces.booking_id
      FROM customer_event_service ces
      JOIN customers c ON ces.customer_id = c.customer_id
      JOIN event_service es ON ces.event_service_id = es.Event_Service_ID
    `;
    const [rows] = await db.query(query);
    return rows;
  }

  static async getById(id) {
    const query = `
      SELECT 
        ces.my_row_id,
        ces.customer_id,
        c.name AS customer_name,
        ces.event_service_id,
        es.Event_Service_Name AS service_name,
        ces.booking_id
      FROM customer_event_service ces
      JOIN customers c ON ces.customer_id = c.customer_id
      JOIN event_service es ON ces.event_service_id = es.Event_Service_ID
      WHERE ces.my_row_id = ?
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0] || null;
  }

  static async create(data) {
    const { customer_id, event_service_id, booking_id } = data;
    const query = `
      INSERT INTO customer_event_service 
        (customer_id, event_service_id, booking_id) 
      VALUES (?, ?, ?)
    `;
    const [result] = await db.query(query, [customer_id, event_service_id, booking_id]);
    return { my_row_id: result.insertId, ...data };
  }

  static async update(id, data) {
    const { customer_id, event_service_id, booking_id } = data;
    const query = `
      UPDATE customer_event_service 
      SET 
        customer_id = ?,
        event_service_id = ?,
      WHERE booking_id = ?
    `;
    await db.query(query, [customer_id, event_service_id, booking_id, id]);
    return { my_row_id: id, ...data };
  }

  static async delete(id) {
    const query = 'DELETE FROM customer_event_service WHERE my_row_id = ?';
    await db.query(query, [id]);
    return true;
  }

  static async getAllCustomer() {
    const query = `
      SELECT 
        customer_id, 
        name, 
        email,
        address,
        phone,
        staus AS status,
        create_date AS created_at
      FROM customers
      WHERE staus = 'active'
      ORDER BY name
    `;
    const [rows] = await db.query(query);
    return rows;
  }

  static async getAllBooking() {
    const query = `
      SELECT 
        b.booking_id,
        b.booking_date,
        b.time_slot,
        b.status,
        b.total_price,
        b.number_of_guests,
        b.additional_hours,
        b.customer_id,
        c.name AS customer_name,
        c.email AS customer_email,
        c.phone AS customer_phone
      FROM booking b
      JOIN customers c ON b.customer_id = c.customer_id
      WHERE b.status IN ('confirmed', 'pending')
      ORDER BY b.booking_date DESC
    `;
    const [rows] = await db.query(query);
    return rows;
  }

  static async getAllEventServicesSimple() {
    let connection;
    try {
      connection = await db.getConnection();
      const [events] = await connection.query(`
            SELECT 
                Event_Service_ID AS id,
                Event_Service_Name AS name
            FROM event_service
        `);
      return events;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

}

export default CustomerEventService;