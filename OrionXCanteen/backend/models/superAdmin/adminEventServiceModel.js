import db from '../../config/db.js';

class adminEventService {
    static async getAllEventServices() {
        let connection;
        try {
            connection = await db.getConnection();
            const [events] = await connection.query('SELECT * FROM event_service');
            return events;
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
    static async createEventService(eventData) {
        let connection;
        try {
            connection = await db.getConnection();
            const [result] = await connection.query(
                'INSERT INTO event_service (Event_Service_Name, image_path) VALUES (?, ?)',
                [eventData.eventServiceName, eventData.imagePath]
            );
            return { id: result.insertId, ...eventData };
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async updateEventService(eventId, eventData) {
        let connection;
        try {
            connection = await db.getConnection();
            const [result] = await connection.query(
                'UPDATE event_service SET Event_Service_Name = ?, image_path = ? WHERE Event_Service_ID = ?',
                [eventData.eventServiceName, eventData.imagePath, eventId]
            );
            if (result.affectedRows === 0) {
                throw new Error(`Event not found: ${eventId}`);
            }
            return { id: eventId, ...eventData };
        } catch (error) {
            console.error('Error updating event:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
    static async deleteEventService(eventId) {
        let connection;
        try {
            connection = await db.getConnection();

            // First get the image path
            const [service] = await connection.query(
                'SELECT image_path FROM event_service WHERE Event_Service_ID = ?',
                [eventId]
            );

            if (service.length === 0) {
                throw new Error('Event not found');
            }

            const imagePath = service[0].image_path;

            // Delete the record
            const [result] = await connection.query(
                'DELETE FROM event_service WHERE Event_Service_ID = ?',
                [eventId]
            );

            if (result.affectedRows === 0) {
                throw new Error('Event not found');
            }

            return {
                message: 'Event deleted successfully',
                imagePath // Return for potential cleanup
            };
        } catch (error) {
            console.error('Error deleting event:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async getEventServiceById(serviceId) {
        let connection;
        try {
            connection = await db.getConnection();
            const [service] = await connection.query(
                'SELECT * FROM event_service WHERE Event_Service_ID = ?',
                [serviceId]
            );
            if (service.length === 0) {
                throw new Error(`Service not found: ${serviceId}`);
            }
            return service[0];
        } catch (error) {
            console.error('Error fetching service by ID:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
    // Add this method to your existing class
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

export default adminEventService;

