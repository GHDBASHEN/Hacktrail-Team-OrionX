// assignedEmployeeModel.js
import db from '../../config/db.js';

class AssignedEmployee {
    static async assignEmployeeToEvent(assignmentData) {
        let connection;
        try {
            const { employeeId, userRole, eventId } = assignmentData;
            connection = await db.getConnection();

            //await connection.beginTransaction();
            await connection.query('START TRANSACTION');

            const [booking] = await connection.query(
                `SELECT b.booking_date 
                    FROM event e
                    JOIN booking b ON e.booking_id = b.booking_id
                    WHERE e.Event_ID = ?`,
                [eventId]
            );

            // 1. Generate sequential Employee_Assign_ID
            const [maxIdResult] = await connection.query(
                `SELECT MAX(Employee_Assign_ID) AS maxId 
                FROM assigned_employee 
                WHERE Employee_Assign_ID LIKE 'EAE%' 
                FOR UPDATE`
            );

            let nextNumber = 1;
            if (maxIdResult[0].maxId) {
                const currentMax = maxIdResult[0].maxId;
                nextNumber = parseInt(currentMax.substring(3), 10) + 1;
            }

            const employeeAssignId = `EAE${nextNumber.toString().padStart(6, '0')}`;

            // 2. Check for existing ID (safety check)
            const [existing] = await connection.query(
                `SELECT Employee_Assign_ID 
                FROM assigned_employee 
                WHERE Employee_Assign_ID = ?`,
                [employeeAssignId]
            );

            if (existing.length > 0) {
                throw new Error('Duplicate Employee_Assign_ID detected');
            }

            // 3. Validate employees and event existence
            const [employees] = await connection.query(
                `SELECT employee_id 
                FROM employees 
                WHERE employee_id = ?`,
                [employeeId]
            );

            const [event] = await connection.query(
                `SELECT Event_ID 
                FROM event 
                WHERE Event_ID = ?`,
                [eventId]
            );

            if (employees.length === 0) throw new Error('Employee not found');
            if (event.length === 0) throw new Error('Event not found');

            // 4. Insert records
            await connection.query(
                `INSERT INTO assigned_employee 
                (Employee_Assign_ID, Employee_ID, User_Role) 
                VALUES (?, ?, ?)`,
                [employeeAssignId, employeeId, userRole]
            );

            await connection.query(
                `INSERT INTO event_assigned_employee 
                (Event_ID, Employee_Assign_ID, Event_Date) 
                VALUES (?, ?, ?)`,
                [eventId, employeeAssignId, booking[0].booking_date]
            );

            await connection.query('COMMIT');
            // await connection.commit();
            return { employeeAssignId, eventId };

        } catch (error) {
            if (connection) await connection.rollback();
            console.error("Database Error:", error.message);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    static async getAssignmentOptions() {
        try {
            // Get all available employees
            const [employees] = await db.query(`
                SELECT 
                    e.employee_id AS id,
                    e.name,
                    e.phone,
                    e.email,
                    e.service_charge_precentage AS chargePercentage
                FROM employees e
                INNER JOIN systemuser s ON e.employee_id = s.employee_id
                WHERE s.status = 'active' 
                ORDER BY e.name
            `);

            // Get all upcoming events
            const [events] = await db.query(`
                SELECT
                    e.Event_ID AS id,
                    b.booking_date AS event_date,
                    e.Function_durationFrom AS startTime,
                    e.Function_durationTo AS endTime,
                    b.booking_id,
                    CASE
                        WHEN ce.Event_ID IS NOT NULL THEN ce.Event_Name
                        WHEN w.Event_ID IS NOT NULL THEN CONCAT('Wedding - ', w.Groom_Name)
                        ELSE e.Event_ID
                    END AS event_name
                FROM event e
                LEFT JOIN booking b ON e.booking_id = b.booking_id
                LEFT JOIN customevent ce ON e.Event_ID = ce.Event_ID
                LEFT JOIN wedding w ON e.Event_ID = w.Event_ID
                where b.status = 'done'
                ORDER BY b.booking_date DESC;

            `);

            return {
                employees: employees.map(emp => ({
                    ...emp,
                    label: `${emp.name} (${emp.phone})`
                })),
                events: events.map(evt => ({
                    ...evt,
                    label: `${evt.event_name} (Event ${evt.id} - ${new Date(evt.event_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric'
                    })})`
                }))
            };

        } catch (error) {
            console.error("Database Error (getAssignmentOptions):", error);
            throw new Error("Failed to fetch assignment options");
        }
    }

    static async getAssignments() {
        try {
            const [results] = await db.query(`
SELECT 
    ae.Employee_Assign_ID AS assignmentId,
    ae.User_Role AS userRole,
    eae.Event_Date AS eventDate,
    e.Event_ID AS eventId,
    emp.employee_id AS employeeId,
    emp.name AS employeeName,
    evt.event_name AS eventName,
    e.booking_id AS bookingId  
FROM assigned_employee ae
JOIN event_assigned_employee eae ON ae.Employee_Assign_ID = eae.Employee_Assign_ID
JOIN event e ON eae.Event_ID = e.Event_ID
JOIN employees emp ON ae.Employee_ID = emp.employee_id
LEFT JOIN (
    SELECT 
        ce.Event_ID,
        ce.Event_Name AS event_name,
        e.booking_id  
    FROM customevent ce
    JOIN event e ON ce.Event_ID = e.Event_ID
    UNION ALL
    SELECT 
        w.Event_ID,
        CONCAT('Wedding - ', w.Groom_Name) AS event_name,
        e.booking_id  
    FROM wedding w
    JOIN event e ON w.Event_ID = e.Event_ID
) evt ON e.Event_ID = evt.Event_ID
        `);

            return results.map(row => ({
                assignmentId: row.assignmentId,
                userRole: row.userRole,
                eventDate: row.eventDate,
                event: {
                    id: row.eventId,
                    label: `${row.eventName} (Event ${row.eventId})`
                },
                employees: {
                    id: row.employeeId,
                    name: row.employeeName
                }
            }));
        } catch (error) {
            console.error("Database Error (getAssignments):", error);
            throw new Error("Failed to fetch assignments");
        }
    }


    static async updateAssignment(assignmentId, updateData) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            await connection.query(
                `UPDATE assigned_employee 
       SET User_Role = ?
       WHERE Employee_Assign_ID = ?`,
                [updateData.userRole, assignmentId]
            );

            await connection.commit();

            const [updated] = await connection.query(
                `SELECT * FROM assigned_employee
       WHERE Employee_Assign_ID = ?`,
                [assignmentId]
            );

            return updated[0];
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection?.release();
        }
    }

    static async deleteAssignment(assignmentId) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            await connection.query(
                `DELETE FROM event_assigned_employee 
                  WHERE Employee_Assign_ID = ?`,
                [assignmentId]
            );

            await connection.query(
                `DELETE FROM assigned_employee 
                 WHERE Employee_Assign_ID = ?`,
                [assignmentId]
            );

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection?.release();
        }
    }

}

export default AssignedEmployee;