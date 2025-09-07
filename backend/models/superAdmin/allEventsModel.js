// models/CombinedEvent.js
import db from '../../config/db.js';

class AllEvent {

  static async update(eventId, eventData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Check existence in type-specific tables
      const [weddingExists] = await connection.query(
        'SELECT 1 FROM wedding WHERE Event_ID = ?',
        [eventId]
      );
      const [customExists] = await connection.query(
        'SELECT 1 FROM customevent WHERE Event_ID = ?',
        [eventId]
      );

      const isWedding = weddingExists.length > 0;
      const isCustom = customExists.length > 0;

      if (!isWedding && !isCustom) {
        throw new Error('Event not found in wedding or custom tables');
      }

      // Update base event table
      await connection.query(
        `UPDATE event SET
      Buffet_TimeFrom = ?,
      Buffet_TimeTo = ?,
      Additional_Time = ?,
      Function_durationFrom = ?,
      Function_durationTo = ?,
      Tea_table_Time = ?,
      Dress_Time = ?
      WHERE Event_ID = ?`,
        [
          eventData.Buffet_TimeFrom || null,
          eventData.Buffet_TimeTo || null,
          eventData.Additional_Time || null,
          eventData.Function_durationFrom || null,
          eventData.Function_durationTo || null,
          eventData.Tea_table_Time || null,
          eventData.Dress_Time || null,
          eventId
        ]
      );

      // Update type-specific table
      if (isWedding) {
        await connection.query(
          `UPDATE wedding SET
        Groom_Name = ?,
        Bride_Name = ?,
        Groom_Contact_no = ?,
        Bride_Contact_no = ?,
        Poruwa_CeremonyFrom = ?,
        Poruwa_CeremonyTo = ?,
        Registration_Time = ?,
        Fountain = ?,
        ProsperityTable = ?,
        Groom_Address = ?,
        Bride_Address = ?
        WHERE Event_ID = ?`,
          [
            eventData.details?.groomName || eventData.Groom_Name || '',
            eventData.details?.brideName || eventData.Bride_Name || '',
            eventData.details?.groomContact || eventData.Groom_Contact_no || '',
            eventData.details?.brideContact || eventData.Bride_Contact_no || '',
            eventData.details?.poruwaCeremonyFrom || eventData.Poruwa_CeremonyFrom || null,
            eventData.details?.poruwaCeremonyTo || eventData.Poruwa_CeremonyTo || null,
            eventData.details?.registrationTime || eventData.Registration_Time || null,
            eventData.details?.fountain || eventData.Fountain || 'no',
            eventData.details?.prosperityTable || eventData.ProsperityTable || 'no',
            eventData.details?.groomAddress || eventData.Groom_Address || '',
            eventData.details?.brideAddress || eventData.Bride_Address || '',
            eventId
          ]
        );
      } else if (isCustom) {
        await connection.query(
          `UPDATE customevent SET
        Event_Name = ?,
        ContactPersonName = ?,
        ContactPersonNumber = ?
        WHERE Event_ID = ?`,
          [
            eventData.Event_Name || eventData.Custom_Event_Name || '',
            eventData.details?.contactPersonName || eventData.ContactPersonName || '',
            eventData.details?.contactPersonNumber || eventData.ContactPersonNumber || '',
            eventId
          ]
        );
      }

      await connection.commit();

      // Return updated event
      const [updated] = await connection.query(
        `SELECT * FROM event 
       LEFT JOIN wedding ON event.Event_ID = wedding.Event_ID
       LEFT JOIN customevent ON event.Event_ID = customevent.Event_ID
       WHERE event.Event_ID = ?`,
        [eventId]
      );
      return updated[0];

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Delete event and type-specific details
  static async delete(eventId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Get all associated IDs from the Event table first.
      const [eventRows] = await connection.query(
        'SELECT booking_id, BarRequirementID FROM Event WHERE Event_ID = ?',
        [eventId]
      );

      if (eventRows.length === 0) {
        await connection.commit();
        console.log(`Event with ID ${eventId} not found. Nothing to delete.`);
        return true;
      }

      const { booking_id, BarRequirementID } = eventRows[0];



      // 3. Clean up Table Arrangement data (if it exists).
      // This is a deep chain of dependencies that must be deleted from the inside out.
      const [tableChairRows] = await connection.query(
        'SELECT Arrangement_Id FROM event_table_chair WHERE Event_ID = ?',
        [eventId]
      );

      if (tableChairRows.length > 0) {
        const { Arrangement_Id } = tableChairRows[0];
        // Delete from the junction table first.
        await connection.query('DELETE FROM arrangement_reservation WHERE Arrangement_ID = ?', [Arrangement_Id]);


        const [arrangementRows] = await connection.query(
          'SELECT Table_Reserve_ID FROM table_chair_arrangement WHERE Arrangement_ID = ?',
          [Arrangement_Id]
        );
        if (arrangementRows.length > 0 && arrangementRows[0].Table_Reserve_ID) {
          const { Table_Reserve_ID } = arrangementRows[0];
          await connection.query('DELETE FROM table_reserve WHERE Table_Reserve_ID = ?', [Table_Reserve_ID]);
        }
        // Now delete the arrangement and the event's link to it.
        await connection.query('DELETE FROM table_chair_arrangement WHERE Arrangement_ID = ?', [Arrangement_Id]);
        await connection.query('DELETE FROM event_table_chair WHERE Event_ID = ?', [eventId]);
      }

      await connection.query('DELETE FROM event_cordinator WHERE Event_ID = ?', [eventId]);
      await connection.query('DELETE FROM event_assigned_employee WHERE Event_ID = ?', [eventId]);
      await connection.query('DELETE FROM event_event_service WHERE Event_ID = ?', [eventId]);

      // 5. Clean up dependencies linked via booking_id.
      if (booking_id) {
        await connection.query('DELETE FROM customer_event_service WHERE booking_id = ?', [booking_id]);
      }

      await connection.query('DELETE FROM Wedding WHERE Event_ID = ?', [eventId]);
      await connection.query('DELETE FROM CustomEvent WHERE Event_ID = ?', [eventId]);

      // 2. Clean up Bar-related data (if it exists).
      // These tables are referenced by the Bar table.
      if (BarRequirementID) {
        await connection.query('DELETE FROM Bite WHERE BarRequirementID = ?', [BarRequirementID]);
        await connection.query('DELETE FROM liquor_items WHERE BarRequirementID = ?', [BarRequirementID]);
        await connection.query('DELETE FROM soft_drink_items WHERE BarRequirementID = ?', [BarRequirementID]);
        // Now delete the Bar record itself.
      }
      await connection.query('DELETE FROM Bar WHERE BarRequirementID = ?', [BarRequirementID]);
      // 4. Clean up other direct event dependencies.
      // These tables all have a foreign key pointing directly to the Event table.
      // They MUST be cleared before deleting the event.



      // 6. FINALLY: Now that all child records are gone, delete the master Event record.

      await connection.query('DELETE FROM Event WHERE Event_ID = ?', [eventId]);
      // Note: We are not deleting the booking or customers itself, as they might be related to other records.

      await connection.commit();
      console.log(`Successfully deleted event ${eventId} and all related data.`);
      return true;

    } catch (error) {
      await connection.rollback();
      console.error(`Error deleting event ${eventId}:`, error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get all events with type-specific details
  static async getAll() {
    const [events] = await db.query(`
    SELECT
      e.Event_ID,
      e.Buffet_TimeFrom,
      e.Buffet_TimeTo,
      e.Additional_Time,
      e.Function_durationFrom,
      e.Function_durationTo,
      e.Tea_table_Time,
      e.Dress_Time,
      e.booking_id,
      b.booking_date AS Event_Date,
      b.status,
      b.time_slot,
      b.number_of_guests,
      b.additional_hours,
      b.total_price,
      w.Groom_Name,
      w.Bride_Name,
      w.Groom_Contact_no,
      w.Bride_Contact_no,
      w.Poruwa_CeremonyFrom,
      w.Poruwa_CeremonyTo,
      w.Registration_Time,
      w.Fountain,
      w.ProsperityTable,
      w.Groom_Address,
      w.Bride_Address,
      c.Event_Name AS CustomEvent_Name,
      c.ContactPersonName,
      c.ContactPersonNumber
    FROM Event e
    LEFT JOIN Wedding w ON e.Event_ID = w.Event_ID
    LEFT JOIN CustomEvent c ON e.Event_ID = c.Event_ID
    LEFT JOIN Booking b ON e.booking_id = b.booking_id
    WHERE b.status IN ('confirmed', 'done','pending', 'cancelled')
  `);

    return events.map(event => {
      return {
        ...event,
        eventType: event.Groom_Name ? 'wedding' : 'custom',
        details: event.Groom_Name
          ? {
            groomName: event.Groom_Name,
            brideName: event.Bride_Name,
            groomContact: event.Groom_Contact_no,
            brideContact: event.Bride_Contact_no,
            poruwaCeremonyFrom: event.Poruwa_CeremonyFrom,
            poruwaCeremonyTo: event.Poruwa_CeremonyTo,
            registrationTime: event.Registration_Time,
            fountain: event.Fountain,
            prosperityTable: event.ProsperityTable,
            groomAddress: event.Groom_Address,
            brideAddress: event.Bride_Address
          }
          : {
            eventName: event.CustomEvent_Name,
            contactPersonName: event.ContactPersonName,
            contactPersonNumber: event.ContactPersonNumber
          }
      };
    });
  }

  // Get single event with details
  static async getById(eventId) {
    const [events] = await db.query(`
      SELECT 
        e.*,
        w.*,
        c.*
      FROM Event e
      LEFT JOIN Wedding w ON e.Event_ID = w.Event_ID
      LEFT JOIN CustomEvent c ON e.Event_ID = c.Event_ID
      WHERE e.Event_ID = ?
    `, [eventId]);

    if (events.length === 0) return null;

    const event = events[0];
    return {
      ...event,
      eventType: event.Event_Type,
      details: event.Event_Type === 'wedding' ? {
        groomName: event.Groom_Name,
        brideName: event.Bride_Name,
        poruwaTime: event.Poruwa_Time
      } : {
        eventName: event.Event_Name,
        contactPerson: event.Contact_Person,
        specialRequirements: event.Special_Requirements
      }
    };
  }
}

export default AllEvent;