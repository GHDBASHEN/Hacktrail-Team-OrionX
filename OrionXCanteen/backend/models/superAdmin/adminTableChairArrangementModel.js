import db from '../../config/db.js';

class AdminTableChairArrangement {
    static async getAllArrangements() {
        let connection;
        try {
            connection = await db.getConnection();
            const [arrangements] = await connection.query(`
                SELECT
                    c.name AS customer_name,
                    b.booking_date,
                    v.venue_name,
                    v.Location,
                    CASE
                        WHEN w.Event_ID IS NOT NULL THEN 'wedding'
                        ELSE ce.Event_Name
                    END AS event_name,
                    tca.Arrangement_ID,
                    tca.Head_Table_Pax,
                    tca.Top_Cloth_Color,
                    tca.Table_Cloth_Color,
                    tca.Bow_Color,
                    tca.Chair_Cover_Color,
                    GROUP_CONCAT(tr.Table_Number) AS reserved_tables,
                    GROUP_CONCAT(tr.Reserve_Name) AS reserve_names
                FROM
                    customers c
                JOIN
                    booking b ON c.customer_id = b.customer_id
                JOIN
                    venue v ON b.venue_id = v.venue_id
                JOIN
                    event e ON b.booking_id = e.booking_id
                LEFT JOIN
                    wedding w ON e.Event_ID = w.Event_ID
                LEFT JOIN
                    customevent ce ON e.Event_ID = ce.Event_ID
                JOIN
                    event_table_chair etc ON e.Event_ID = etc.Event_ID
                JOIN
                    table_chair_arrangement tca ON etc.Arrangement_Id = tca.Arrangement_ID
                LEFT JOIN
                    arrangement_reservation ar ON tca.Arrangement_ID = ar.Arrangement_ID
                LEFT JOIN
                    table_reserve tr ON ar.Table_Reserve_ID = tr.Table_Reserve_ID
                WHERE
                    w.Event_ID IS NOT NULL OR ce.Event_ID IS NOT NULL
                GROUP BY
                    c.name,
                    b.booking_date,
                    v.venue_name,
                    v.Location,
                    event_name, -- Grouping by the alias is often sufficient
                    w.Event_ID, -- Explicitly including the columns from the CASE statement
                    ce.Event_Name, -- Explicitly including the columns from the CASE statement
                    tca.Arrangement_ID,
                    tca.Head_Table_Pax,
                    tca.Top_Cloth_Color,
                    tca.Table_Cloth_Color,
                    tca.Bow_Color,
                    tca.Chair_Cover_Color
            `);
            return arrangements;
        } catch (error) {
            console.error('Error fetching arrangements:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async getevents() {
        let connection;
        try {
            connection = await db.getConnection();
            const [events] = await connection.query(`
            SELECT
                e.Event_ID,
                b.booking_date,
                c.name AS customer_name
            FROM event AS e
            JOIN booking AS b
                ON e.booking_id = b.booking_id
            JOIN customers AS c
                ON b.customer_id = c.customer_id
        `);
            return events;
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }


    static async createArrangement(arrangementData) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            // 1. Generate a new Arrangement ID by fetching the last one.
            const [lastArrangement] = await connection.query(
                "SELECT Arrangement_ID FROM table_chair_arrangement ORDER BY Arrangement_ID DESC LIMIT 1"
            );

            let newArrangementId = 'TCA000001';
            if (lastArrangement.length > 0) {
                const lastId = parseInt(lastArrangement[0].Arrangement_ID.replace('TCA', ''), 6);
                newArrangementId = `TCA${(lastId + 1).toString().padStart(6, '0')}`;
            }

            // 2. Insert the main arrangement record.
            await connection.query(
                `INSERT INTO table_chair_arrangement 
                (Arrangement_ID, Head_Table_Pax, Top_Cloth_Color, Table_Cloth_Color, Bow_Color, Chair_Cover_Color) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    newArrangementId,
                    arrangementData.Head_Table_Pax,
                    arrangementData.Top_Cloth_Color,
                    arrangementData.Table_Cloth_Color,
                    arrangementData.Bow_Color,
                    arrangementData.Chair_Cover_Color
                ]
            );

            // 3. Link the event to the new arrangement.
            await connection.query(
                `INSERT INTO event_table_chair (Event_ID, Arrangement_Id) VALUES (?, ?)`,
                [arrangementData.Event_ID, newArrangementId]
            );

            // 4. Handle table reservations.
            if (arrangementData.reservedTables && arrangementData.reservedTables.length > 0) {

                // Get the last reservation ID ONCE before the loop to be efficient.
                const [lastReserve] = await connection.query(
                    "SELECT Table_Reserve_ID FROM table_reserve ORDER BY Table_Reserve_ID DESC LIMIT 1"
                );

                let reserveIdCounter = 0;
                if (lastReserve.length > 0) {
                    reserveIdCounter = parseInt(lastReserve[0].Table_Reserve_ID.replace('TAB', ''), 6);
                }

                for (const table of arrangementData.reservedTables) {
                    // Process only if the table has valid data.
                    if (table.tableNumber && table.reserveName) {

                        // Increment the counter for each new reservation.
                        reserveIdCounter++;
                        const newReserveId = `TAB${reserveIdCounter.toString().padStart(6, '0')}`;

                        // Insert the new reservation.
                        await connection.query(
                            `INSERT INTO table_reserve (Table_Reserve_ID, Table_Number, Reserve_Name) VALUES (?, ?, ?)`,
                            [newReserveId, table.tableNumber, table.reserveName]
                        );

                        // Link the arrangement to the reservation.
                        await connection.query(
                            `INSERT INTO arrangement_reservation (Arrangement_ID, Table_Reserve_ID) VALUES (?, ?)`,
                            [newArrangementId, newReserveId]
                        );
                    }
                }
            }

            await connection.commit();
            return { id: newArrangementId, ...arrangementData };

        } catch (error) {
            if (connection) await connection.rollback();
            console.error('Error creating arrangement:', error);
            throw new Error('Failed to create arrangement in the database.');
        } finally {
            if (connection) connection.release();
        }
    }



    static async updateArrangement(arrangementId, arrangementData) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            // 1. Update the main arrangement details
            const [result] = await connection.query(
                `UPDATE table_chair_arrangement 
             SET Head_Table_Pax = ?, Top_Cloth_Color = ?, Table_Cloth_Color = ?, Bow_Color = ?, Chair_Cover_Color = ? 
             WHERE Arrangement_ID = ?`,
                [
                    arrangementData.Head_Table_Pax,
                    arrangementData.Top_Cloth_Color,
                    arrangementData.Table_Cloth_Color,
                    arrangementData.Bow_Color,
                    arrangementData.Chair_Cover_Color,
                    arrangementId
                ]
            );

            if (result.affectedRows === 0) {
                throw new Error(`Arrangement not found: ${arrangementId}`);
            }

            // 2. Delete all existing reservations for this arrangement.
            // This is inefficient but matches the provided logic.
            await connection.query(
                `DELETE ar, tr 
             FROM arrangement_reservation ar
             JOIN table_reserve tr ON ar.Table_Reserve_ID = tr.Table_Reserve_ID
             WHERE ar.Arrangement_ID = ?`,
                [arrangementId]
            );

            // 3. Get the last reservation ID from the table to calculate the next one.
            // WARNING: This is not safe for concurrent requests and can cause duplicate key errors.
            const [lastReserve] = await connection.query(
                "SELECT Table_Reserve_ID FROM table_reserve ORDER BY Table_Reserve_ID DESC LIMIT 1"
            );

            let reserveIdCounter = 0;
            if (lastReserve.length > 0 && lastReserve[0].Table_Reserve_ID) {
                // Safely parse the numeric part of the last ID.
                const numericPart = lastReserve[0].Table_Reserve_ID.replace('TAB', '');
                if (!isNaN(numericPart) && numericPart.length > 0) {
                    reserveIdCounter = parseInt(numericPart, 10);
                }
            }

            // 4. Create new reservations from the provided data.
            for (const table of arrangementData.reservedTables) {
                // Process only if the table has valid data.
                if (table.tableNumber && table.reserveName) {

                    // Increment the counter for each new reservation.
                    reserveIdCounter++;
                    const newReserveId = `TAB${reserveIdCounter.toString().padStart(6, '0')}`;

                    // Insert the new reservation record.
                    await connection.query(
                        `INSERT INTO table_reserve (Table_Reserve_ID, Table_Number, Reserve_Name) VALUES (?, ?, ?)`,
                        [newReserveId, table.tableNumber, table.reserveName]
                    );

                    // Link the arrangement to the new reservation.
                    // FIX: Used the correct 'arrangementId' variable instead of the undefined 'newArrangementId'.
                    await connection.query(
                        `INSERT INTO arrangement_reservation (Arrangement_ID, Table_Reserve_ID) VALUES (?, ?)`,
                        [arrangementId, newReserveId]
                    );
                }
            }

            await connection.commit();
            return { id: arrangementId, ...arrangementData };

        } catch (error) {
            if (connection) await connection.rollback();
            console.error('Error updating arrangement:', error);
            throw error;

        } finally {
            if (connection) connection.release();
        }
    }

    static async deleteArrangement(arrangementId) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();



            const [Reserve] = await connection.query(
                "SELECT Table_Reserve_ID FROM arrangement_reservation WHERE Arrangement_ID = ? ",
                [arrangementId]
            );

            const reserveID = Reserve[0].Table_Reserve_ID


            // Delete arrangement reservations.
            const [result3] = await connection.query(
                'DELETE FROM arrangement_reservation WHERE Arrangement_ID = ?',
                [arrangementId]
            );

            // Delete from arrangement_reservation and table_reserve
            await connection.query(
                `DELETE FROM table_reserve WHERE Table_Reserve_ID = ?`,
                [reserveID]
            );


            // Delete arrangement
            const [result] = await connection.query(
                'DELETE FROM table_chair_arrangement WHERE Arrangement_ID = ?',
                [arrangementId]
            );

            const [result4] = await connection.query(
                'DELETE FROM event_table_chair WHERE Arrangement_ID = ?',
                [arrangementId]
            );


            if (result.affectedRows === 0) {
                throw new Error(`Arrangement not found: ${arrangementId}`);
            }

            await connection.commit();
            return { message: 'Arrangement deleted successfully' };
        } catch (error) {
            if (connection) await connection.rollback();
            console.error('Error deleting arrangement:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async getArrangementById(arrangementId) {
        let connection;
        try {
            connection = await db.getConnection();
            const [arrangement] = await connection.query(
                `SELECT tca.*, 
                tr.Table_Reserve_ID, tr.Table_Number, tr.Reserve_Name
                FROM table_chair_arrangement tca
                LEFT JOIN arrangement_reservation ar ON tca.Arrangement_ID = ar.Arrangement_ID
                LEFT JOIN table_reserve tr ON ar.Table_Reserve_ID = tr.Table_Reserve_ID
                WHERE tca.Arrangement_ID = ?`,
                [arrangementId]
            );

            if (arrangement.length === 0) {
                throw new Error(`Arrangement not found: ${arrangementId}`);
            }

            // Transform to single arrangement with tables array
            const transformed = {
                ...arrangement[0],
                reservedTables: arrangement
                    .filter(row => row.Table_Reserve_ID)
                    .map(row => ({
                        tableReserveId: row.Table_Reserve_ID,
                        tableNumber: row.Table_Number,
                        reserveName: row.Reserve_Name
                    }))
            };

            delete transformed.Table_Reserve_ID;
            delete transformed.Table_Number;
            delete transformed.Reserve_Name;

            return transformed;
        } catch (error) {
            console.error('Error fetching arrangement by ID:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
}

export default AdminTableChairArrangement;