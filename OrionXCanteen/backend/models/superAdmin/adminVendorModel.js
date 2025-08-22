import db from '../../config/db.js';

class AdminVendor {
    static async getAllVendors() {
        let connection;
        try {
            connection = await db.getConnection();
            const [vendors] = await connection.query(`
      SELECT 
        v.Vendor_ID AS id,
        v.Contact_no AS contact,
        v.Email AS email,
        v.Address AS address,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', es.Event_Service_ID,
              'name', es.Event_Service_Name
            )
          )
          FROM event_service_vendor esv
          JOIN event_service es ON esv.event_service_id = es.Event_Service_ID
          WHERE esv.vendor_id = v.Vendor_ID
        ) AS services
      FROM vendor v
      ORDER BY v.Vendor_ID
    `);

            // Parse JSON services
            return vendors.map(vendor => ({
                ...vendor,
                services: typeof vendor.services === 'string'
                    ? JSON.parse(vendor.services)
                    : (vendor.services || [])
            }));
        } catch (error) {
            console.error('Error fetching vendors:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async createVendor(vendorData) {
        let connection;
        try {
            connection = await db.getConnection();
            const [result] = await connection.query(
                'INSERT INTO vendor (Vendor_ID, Contact_no, Email, Address) VALUES (?, ?, ?, ?)',
                [vendorData.id, vendorData.contact, vendorData.email, vendorData.address]
            );
            return { ...vendorData };
        } catch (error) {
            console.error('Error creating vendor:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async updateVendor(vendorId, vendorData) {
        if (!vendorId) {
            throw new Error('Vendor ID is required for update');
        }
        let connection;
        try {
            connection = await db.getConnection();
            const [result] = await connection.query(
                'UPDATE vendor SET Contact_no = ?, Email = ?, Address = ? WHERE Vendor_ID = ?',
                [vendorData.contact, vendorData.email, vendorData.address, vendorId]
            );
            if (result.affectedRows === 0) {
                throw new Error(`Vendor not found: ${vendorId}`);
            }
            return { ...vendorData };
        } catch (error) {
            console.error('Error updating vendor:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async deleteVendor(vendorId) {
        let connection;
        try {
            connection = await db.getConnection();
            const [result] = await connection.query(
                'DELETE FROM vendor WHERE Vendor_ID = ?',
                [vendorId]
            );
            if (result.affectedRows === 0) {
                throw new Error('Vendor not found');
            }
            return { message: 'Vendor deleted successfully' };
        } catch (error) {
            console.error('Error deleting vendor:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async getVendorServices(vendorId) {
        let connection;
        try {
            connection = await db.getConnection();
            const [services] = await connection.query(`
                SELECT 
                    es.Event_Service_ID AS id,
                    es.Event_Service_Name AS name
                FROM event_service_vendor esv
                JOIN event_service es ON esv.event_service_id = es.Event_Service_ID
                WHERE esv.vendor_id = ?
            `, [vendorId]);
            return services;
        } catch (error) {
            console.error('Error fetching vendor services:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async assignServicesToVendor(vendorId, serviceIds) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            // First remove existing assignments
            await connection.query(
                'DELETE FROM event_service_vendor WHERE vendor_id = ?',
                [vendorId]
            );

            // Add new assignments
            for (const serviceId of serviceIds) {
                await connection.query(
                    'INSERT INTO event_service_vendor (event_service_id, vendor_id) VALUES (?, ?)',
                    [serviceId, vendorId]
                );
            }

            await connection.commit();
            return { message: 'Services assigned successfully' };
        } catch (error) {
            await connection.rollback();
            console.error('Error assigning services:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async getVendorById(vendorId) {
        let connection;
        try {
            connection = await db.getConnection();
            const [vendor] = await connection.query(
                'SELECT * FROM vendor WHERE Vendor_ID = ?',
                [vendorId]
            );
            if (vendor.length === 0) {
                throw new Error(`Vendor not found: ${vendorId}`);
            }
            return vendor[0];
        } catch (error) {
            console.error('Error fetching vendor by ID:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

}


export default AdminVendor;