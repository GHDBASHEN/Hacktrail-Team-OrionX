DROP DATABASE IF EXISTS canteen_db;
CREATE DATABASE canteen_db;
USE canteen_db;

CREATE TABLE customers (
    cus_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password VARCHAR(255),
    role VARCHAR(50) DEFAULT 'customer',
    status VARCHAR(20) DEFAULT 'active',
    refresh_token TEXT,
    address TEXT
);

CREATE TABLE employees (
    emp_id INT AUTO_INCREMENT PRIMARY KEY,
    emp_name VARCHAR(100),
    emp_role VARCHAR(50),
    emp_phone VARCHAR(20)
);

CREATE TABLE category (
    c_id INT AUTO_INCREMENT PRIMARY KEY,
    c_name VARCHAR(100)
);

/* singular “food”, with the columns the code uses */
CREATE TABLE food (
    f_id INT AUTO_INCREMENT PRIMARY KEY,
    c_id INT,
    f_name VARCHAR(100),
    price DECIMAL(10,2),
    stock INT,
    created_date DATE,
    expire_date DATE,
    image_path VARCHAR(255) NULL,
    FOREIGN KEY (c_id) REFERENCES category(c_id)
);

CREATE TABLE inventory (
    inv_id INT AUTO_INCREMENT PRIMARY KEY,
    f_id INT,
    stock INT,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (f_id) REFERENCES food(f_id)
);

/* the “old” daily‑food design that the models expect */
CREATE TABLE daily_food (
    d_id INT AUTO_INCREMENT PRIMARY KEY,
    d_name VARCHAR(100),
    meal_type ENUM('breakfast','lunch','dinner'),
    meal_date DATE,
    meal_price DECIMAL(10,2),
    c_id INT,
    image_path VARCHAR(255) NULL,
    FOREIGN KEY (c_id) REFERENCES category(c_id)
);

CREATE TABLE daily_food_component (
    dfc_id INT AUTO_INCREMENT PRIMARY KEY,
    dfc_name VARCHAR(100),
    dfc_price DECIMAL(10,2)
);

/* junction table used by the application */
CREATE TABLE daily_food_daily_component (
    id INT AUTO_INCREMENT PRIMARY KEY,
    d_id INT,
    dfc_id INT,
    FOREIGN KEY (d_id) REFERENCES daily_food(d_id),
    FOREIGN KEY (dfc_id) REFERENCES daily_food_component(dfc_id)
);

/* …rest of your orders/cart/payments/tokens triggers unchanged… */

CREATE TABLE cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    cus_id INT,
    d_id INT NULL,
    f_id INT NULL,
    item_count INT DEFAULT 0,
    total_amount DECIMAL(10,2) DEFAULT 0,
    created_date DATETIME,

    FOREIGN KEY (cus_id) REFERENCES customers(cus_id)
);

CREATE TABLE cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT,
    d_id INT,
    qty INT,

    FOREIGN KEY (cart_id) REFERENCES cart(cart_id),
    FOREIGN KEY (d_id) REFERENCES daily_food(d_id)
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    cus_id INT,
    emp_id INT,
    cart_id INT,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2),
    status ENUM('Pending','Preparing','Ready','Completed','Cancelled'),
    payment_status ENUM('Pending','Paid','Failed') DEFAULT 'Pending',
    special_note TEXT,
    pickup_date DATE,

    FOREIGN KEY (cus_id) REFERENCES customers(cus_id),
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id),
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id)
);

CREATE TABLE order_items (
    oi_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    d_id INT,
    qty INT,
    price DECIMAL(10,2),

    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (d_id) REFERENCES daily_food(d_id)
);

CREATE TABLE tokens (
    t_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    token_no INT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE TABLE payments (
    pay_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    pay_method ENUM('Cash','Card','Online'),
    pay_status ENUM('Pending','Paid','Failed'),
    amount DECIMAL(10,2),
    pay_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

DELIMITER $$

CREATE TRIGGER gen_token
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    INSERT INTO tokens(order_id, token_no)
    VALUES(
        NEW.order_id,
        (SELECT IFNULL(MAX(token_no),0)+1 FROM tokens)
    );
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER check_stock
BEFORE INSERT ON order_items
FOR EACH ROW
BEGIN
    DECLARE stock_val INT;

    SELECT stock INTO stock_val
    FROM inventory
    WHERE f_id = (SELECT f_id FROM daily_food WHERE d_id = NEW.d_id);

    IF stock_val < NEW.qty THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock not available';
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER reduce_stock
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE inventory
    SET stock = stock - NEW.qty
    WHERE f_id = (SELECT f_id FROM daily_food WHERE d_id = NEW.d_id);
END$$

DELIMITER ;

CREATE TABLE IF NOT EXISTS systemuser (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(50) UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('super_admin','sub_admin','employee') NOT NULL,
  status ENUM('active','inactive') DEFAULT 'active',
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);