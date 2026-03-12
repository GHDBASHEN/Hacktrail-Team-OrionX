USE canteen_db;

DROP TRIGGER IF EXISTS gen_token;
DROP TRIGGER IF EXISTS check_stock;
DROP TRIGGER IF EXISTS reduce_stock;

DELIMITER $$

-- Trigger to generate a sequential token number for each order
CREATE TRIGGER gen_token
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    INSERT INTO tokens(order_id, token_no)
    SELECT NEW.order_id, COALESCE(MAX(token_no), 0) + 1 FROM tokens;
END$$

-- Trigger to check stock before inserting into order_items
CREATE TRIGGER check_stock
BEFORE INSERT ON order_items
FOR EACH ROW
BEGIN
    DECLARE stock_val INT;
    DECLARE linked_f_id INT;

    -- Look up the standard food ID linked to this daily food item
    SELECT f_id INTO linked_f_id FROM daily_food WHERE d_id = NEW.d_id;

    IF linked_f_id IS NOT NULL THEN
        SELECT stock INTO stock_val
        FROM inventory
        WHERE f_id = linked_f_id;

        IF stock_val IS NULL OR stock_val < NEW.qty THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Stock not available';
        END IF;
    END IF;
END$$

-- Trigger to reduce stock after inserting into order_items
CREATE TRIGGER reduce_stock
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    DECLARE linked_f_id INT;

    SELECT f_id INTO linked_f_id FROM daily_food WHERE d_id = NEW.d_id;

    IF linked_f_id IS NOT NULL THEN
        UPDATE inventory
        SET stock = stock - NEW.qty
        WHERE f_id = linked_f_id;
    END IF;
END$$

DELIMITER ;
