import db from '../../config/db.js';

class Bar {
  static async create(barData) {
    const [result] = await db.execute(
      `INSERT INTO bar (BarRequirementID, LiquorTimeFrom, LiquorTimeTo, BarPax, 
       TotalBitePrice, TotalLiquorPrice, TotalSoftDrinkPrice) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        barData.BarRequirementID,
        barData.LiquorTimeFrom,
        barData.LiquorTimeTo,
        barData.BarPax,
        barData.TotalBitePrice,
        barData.TotalLiquorPrice,
        barData.TotalSoftDrinkPrice
      ]
    );
    return result;
  }

  // static async findAll() {
  //   const [rows] = await db.query(`SELECT 
  //       b.*, 
  //       c.name AS customerName, 
  //       bk.booking_date AS eventDate,
  //       CASE
  //           WHEN ce.Event_ID IS NOT NULL THEN ce.Event_Name
  //           WHEN w.Event_ID IS NOT NULL THEN 'Wedding'
  //           ELSE 'Event Details Not Specified'
  //       END AS eventName
  //     FROM bar b
  //     JOIN event e ON b.BarRequirementID = e.BarRequirementID
  //     JOIN booking bk ON e.booking_id = bk.booking_id
  //     JOIN customers c ON bk.customer_id = c.customer_id
  //     LEFT JOIN customevent ce ON e.Event_ID = ce.Event_ID
  //     LEFT JOIN wedding w ON e.Event_ID = w.Event_ID`);
  //   return rows;
  // }

      static async findAll() {
        const [rows] = await db.query(`
             SELECT 
                b.BarRequirementID,
                b.LiquorTimeFrom,
                b.LiquorTimeTo,
                b.BarPax,
                b.TotalBitePrice,
                b.TotalLiquorPrice,
                b.TotalSoftDrinkPrice,
                c.name AS customerName, 
                bk.booking_date AS eventDate,
                CASE
                    WHEN ce.Event_ID IS NOT NULL THEN ce.Event_Name
                    WHEN w.Event_ID IS NOT NULL THEN 'Wedding'
                    ELSE 'Event Not Specified'
                END AS eventName,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', bi.id, 
                            'menu_type_name', mt.menu_type_name, 
                            'Quantity', bi.Quantity,
                            'price', mt.price 
                        )
                    )
                    FROM bite bi
                    JOIN menu_type mt ON bi.menu_type_id = mt.menu_type_id
                    WHERE bi.BarRequirementID = b.BarRequirementID
                ) AS bites,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'Liquor_ID', li.Liquor_ID, 
                            'item_name', li.item_name, 
                            'quantity', li.quantity, 
                            'LiquorPrice', li.LiquorPrice
                        )
                    )
                    FROM liquor_items li
                    WHERE li.BarRequirementID = b.BarRequirementID
                ) AS liquorItems,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'Soft_Drink_id', sdi.Soft_Drink_id, 
                            'Soft_Drink_name', sdi.Soft_Drink_name, 
                            'quantity', sdi.quantity, 
                            'DrinkPrice', sdi.DrinkPrice
                        )
                    )
                    FROM soft_drink_items sdi
                    WHERE sdi.BarRequirementID = b.BarRequirementID
                ) AS softDrinkItems
            FROM bar b
            JOIN event e ON b.BarRequirementID = e.BarRequirementID
            JOIN booking bk ON e.booking_id = bk.booking_id
            JOIN customers c ON bk.customer_id = c.customer_id
            LEFT JOIN customevent ce ON e.Event_ID = ce.Event_ID
            LEFT JOIN wedding w ON e.Event_ID = w.Event_ID
            GROUP BY b.BarRequirementID, c.name, bk.booking_date, eventName
        `);

        // FIX: Check if the field is a string before parsing.
        return rows.map(row => ({
            ...row,
            bites: typeof row.bites === 'string' ? JSON.parse(row.bites) : (row.bites || []),
            liquorItems: typeof row.liquorItems === 'string' ? JSON.parse(row.liquorItems) : (row.liquorItems || []),
            softDrinkItems: typeof row.softDrinkItems === 'string' ? JSON.parse(row.softDrinkItems) : (row.softDrinkItems || []),
        }));
    }


  static async findById(id) {
    const [rows] = await db.execute(`SELECT 
        b.*,
        c.name AS customerName,
        bk.booking_date AS eventDate,
        CASE
            WHEN ce.Event_ID IS NOT NULL THEN ce.Event_Name
            WHEN w.Event_ID IS NOT NULL THEN 'Wedding'
            ELSE 'Event Details Not Specified'
        END AS eventName
      FROM bar b
      JOIN event e ON b.BarRequirementID = e.BarRequirementID
      JOIN booking bk ON e.booking_id = bk.booking_id
      JOIN customers c ON bk.customer_id = c.customer_id
      LEFT JOIN customevent ce ON e.Event_ID = ce.Event_ID
      LEFT JOIN wedding w ON e.Event_ID = w.Event_ID
      WHERE b.BarRequirementID = ?`, [id]);
    return rows[0];
  }

  static async update(id, barData) {
    const [result] = await db.execute(
      `UPDATE bar SET 
        LiquorTimeFrom = ?, 
        LiquorTimeTo = ?, 
        BarPax = ?
       WHERE BarRequirementID = ?`,
      [
        barData.LiquorTimeFrom,
        barData.LiquorTimeTo,
        barData.BarPax,
        id
      ]
    );
    return result;
  }

  static async delete(id) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [barRows] = await connection.query(
        'SELECT Event_ID FROM event WHERE BarRequirementID = ?',
        [id]
      );
      if (barRows.length === 0) {
        throw new Error(`No event found for BarRequirementID ${id}`);

      }
      // Get the Event_ID from the event table
      const eventId = barRows[0].Event_ID;

      // Delete dependent records first
      await connection.query('DELETE FROM bite WHERE BarRequirementID = ?', [id]);
      await connection.query('DELETE FROM liquor_items WHERE BarRequirementID = ?', [id]);
      await connection.query('DELETE FROM soft_drink_items WHERE BarRequirementID = ?', [id]);
      console.log(`Deleted all dependent records for BarRequirementID ${id}`);

      await connection.query('UPDATE event SET BarRequirementID = NULL WHERE Event_ID = ?', [eventId]);


      // Then delete the main bar record
      await connection.query('DELETE FROM bar WHERE BarRequirementID = ?', [id]);


      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      console.error(`Error deleting BarRequirementID ${id}:`, error);
      throw error;
    } finally {
      connection.release();
    }
  }

}


class Bite {
  static async create(biteData) {
    const [result] = await db.execute(
      `INSERT INTO bite (Bite_ID, Quantity, menu_type_id, BarRequirementID) 
       VALUES (?, ?, ?, ?)`,
      [
        biteData.Bite_ID,
        biteData.Quantity,
        biteData.menu_type_id,
        biteData.BarRequirementID
      ]
    );
    return result;
  }

  static async findAll() {
    const [rows] = await db.query(`SELECT 
        bi.*, 
        mt.menu_type_name,
        c.name AS customerName, 
        bk.booking_date AS eventDate,
        CASE
            WHEN ce.Event_ID IS NOT NULL THEN ce.Event_Name
            WHEN w.Event_ID IS NOT NULL THEN 'Wedding'
            ELSE 'Event Details Not Specified'
        END AS eventName
    FROM bite bi
    JOIN menu_type mt ON bi.menu_type_id = mt.menu_type_id
    LEFT JOIN bar b ON bi.BarRequirementID = b.BarRequirementID
    LEFT JOIN event e ON b.BarRequirementID = e.BarRequirementID
    LEFT JOIN booking bk ON e.booking_id = bk.booking_id
    LEFT JOIN customers c ON bk.customer_id = c.customer_id
    LEFT JOIN customevent ce ON e.Event_ID = ce.Event_ID
    LEFT JOIN wedding w ON e.Event_ID = w.Event_ID`);
    return rows;
  }

  static async findByBar(barId) {
    const [rows] = await db.execute(`SELECT 
        bi.*, 
        mt.menu_type_name,
        c.name AS customerName, 
        bk.booking_date AS eventDate,
        CASE
            WHEN ce.Event_ID IS NOT NULL THEN ce.Event_Name
            WHEN w.Event_ID IS NOT NULL THEN 'Wedding'
            ELSE 'Event Details Not Specified'
        END AS eventName
    FROM bite bi
    JOIN menu_type mt ON bi.menu_type_id = mt.menu_type_id
    LEFT JOIN bar b ON bi.BarRequirementID = b.BarRequirementID
    LEFT JOIN event e ON b.BarRequirementID = e.BarRequirementID
    LEFT JOIN booking bk ON e.booking_id = bk.booking_id
    LEFT JOIN customers c ON bk.customer_id = c.customer_id
    LEFT JOIN customevent ce ON e.Event_ID = ce.Event_ID
    LEFT JOIN wedding w ON e.Event_ID = w.Event_ID
      
      WHERE BarRequirementID = ?`, [barId]);
    return rows;
  }

  static async update(id, biteData) {
    const [result] = await db.execute(
      `UPDATE bite SET 
      Quantity = ?
     WHERE id = ?`,
      [
        biteData.Quantity,
        id
      ]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM bite WHERE id = ?', [id]);
    return result;
  }
}

class LiquorItem {
  static async create(liquorData) {
    const [result] = await db.execute(
      `INSERT INTO liquor_items (Liquor_ID, item_name, quantity, usages, BarRequirementID, LiquorPrice) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        liquorData.Liquor_ID,
        liquorData.item_name,
        liquorData.quantity,
        liquorData.usages,
        liquorData.BarRequirementID,
        liquorData.LiquorPrice
      ]
    );
    return result;
  }

  static async findAll() {
    const [rows] = await db.query(`SELECT
    e.Event_ID,
    c.name AS customerName,
    CASE
        WHEN w.Event_ID IS NOT NULL THEN 'Wedding'
        ELSE ce.Event_Name
    END AS eventName,
    bk.booking_date AS eventDate,
    li.*
FROM
    event e
LEFT JOIN
    wedding w ON e.Event_ID = w.Event_ID
LEFT JOIN
    customevent ce ON e.Event_ID = ce.Event_ID
JOIN
    booking bk ON e.booking_id = bk.booking_id
JOIN
    customers c ON bk.customer_id = c.customer_id
JOIN
    bar b ON e.BarRequirementID = b.BarRequirementID
LEFT JOIN
    liquor_items li ON b.BarRequirementID = li.BarRequirementID
WHERE
    e.BarRequirementID IS NOT NULL
GROUP BY
    e.Event_ID, customerName, eventName, eventDate, li.Liquor_ID;`);
    return rows;
  }

  static async findByBar(barId) {
    const [rows] = await db.execute(`
      SELECT
    e.Event_ID,
    c.name AS customerName,
    CASE
        WHEN w.Event_ID IS NOT NULL THEN 'Wedding'
        ELSE ce.Event_Name
    END AS eventName,
    bk.booking_date AS eventDate,
    li.*
FROM
    event e
LEFT JOIN
    wedding w ON e.Event_ID = w.Event_ID
LEFT JOIN
    customevent ce ON e.Event_ID = ce.Event_ID
JOIN
    booking bk ON e.booking_id = bk.booking_id
JOIN
    customers c ON bk.customer_id = c.customer_id
JOIN
    bar b ON e.BarRequirementID = b.BarRequirementID
LEFT JOIN
    liquor_items li ON b.BarRequirementID = li.BarRequirementID
WHERE
    e.BarRequirementID IS NOT NULL
GROUP BY
    e.Event_ID, customerName, eventName, eventDate, li.Liquor_ID
      WHERE BarRequirementID = ?`, [barId]);
    return rows;
  }

  static async update(id, liquorData) {
    const [result] = await db.execute(
      `UPDATE liquor_items SET 
        item_name = ?, 
        quantity = ?, 
        usages = ?, 
        LiquorPrice = ? 
       WHERE BarRequirementID = ?`,
      [
        liquorData.item_name,
        liquorData.quantity,
        liquorData.usages,
        liquorData.LiquorPrice,
        id
      ]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM liquor_items WHERE BarRequirementID = ?', [id]);
    return result;
  }
}

class SoftDrinkItem {
  static async create(softDrinkData) {
    const [result] = await db.execute(
      `INSERT INTO soft_drink_items (Soft_Drink_id, Soft_Drink_name, quantity, usages, BarRequirementID, DrinkPrice) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        softDrinkData.Soft_Drink_id,
        softDrinkData.Soft_Drink_name,
        softDrinkData.quantity,
        softDrinkData.usages,
        softDrinkData.BarRequirementID,
        softDrinkData.DrinkPrice
      ]
    );
    return result;
  }

  static async findAll() {
    const [rows] = await db.query(`
      SELECT 
        sdi.*, 
        c.name AS customerName, 
        bk.booking_date AS eventDate,
        CASE
            WHEN ce.Event_ID IS NOT NULL THEN ce.Event_Name
            WHEN w.Event_ID IS NOT NULL THEN 'Wedding'
            ELSE 'Event Details Not Specified'
        END AS eventName
      FROM soft_drink_items sdi
      JOIN bar b ON sdi.BarRequirementID = b.BarRequirementID
      JOIN event e ON b.BarRequirementID = e.BarRequirementID
      JOIN booking bk ON e.booking_id = bk.booking_id
      JOIN customers c ON bk.customer_id = c.customer_id
      LEFT JOIN customevent ce ON e.Event_ID = ce.Event_ID
      LEFT JOIN wedding w ON e.Event_ID = w.Event_ID`);
    return rows;
  }

  static async findByBar(barId) {
    const [rows] = await db.execute(`
      SELECT 
        sdi.*, 
        c.name AS customerName, 
        bk.booking_date AS eventDate,
        CASE
            WHEN ce.Event_ID IS NOT NULL THEN ce.Event_Name
            WHEN w.Event_ID IS NOT NULL THEN 'Wedding'
            ELSE 'Event Details Not Specified'
        END AS eventName
      FROM soft_drink_items sdi
      JOIN bar b ON sdi.BarRequirementID = b.BarRequirementID
      JOIN event e ON b.BarRequirementID = e.BarRequirementID
      JOIN booking bk ON e.booking_id = bk.booking_id
      JOIN customers c ON bk.customer_id = c.customer_id
      LEFT JOIN customevent ce ON e.Event_ID = ce.Event_ID
      LEFT JOIN wedding w ON e.Event_ID = w.Event_ID
      WHERE BarRequirementID = ?`, [barId]);
    return rows;
  }

  static async update(id, softDrinkData) {
    const [result] = await db.execute(
      `UPDATE soft_drink_items SET 
        Soft_Drink_name = ?, 
        quantity = ?, 
        usages = ?, 
        BarRequirementID = ?, 
        DrinkPrice = ? 
       WHERE Soft_Drink_id = ?`,
      [
        softDrinkData.Soft_Drink_name,
        softDrinkData.quantity,
        softDrinkData.usages,
        softDrinkData.BarRequirementID,
        softDrinkData.DrinkPrice,
        id
      ]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM soft_drink_items WHERE BarRequirementID = ?', [id]);
    return result;
  }
}

export { Bar, Bite, LiquorItem, SoftDrinkItem };