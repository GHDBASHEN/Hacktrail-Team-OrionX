import pool from '../config/db.js';

// export const saveSystemuserRefreshTokenModel = async (token, userId) => {
//     await pool.query('UPDATE systemuser SET refresh_token = ? WHERE user_id = ?', [token, userId]);
// }

// export const saveCustomerRefreshTokenModel = async (token, customer_id) => {
//     await pool.query('UPDATE customers SET refresh_token = ? WHERE customer_id = ?', [token, customer_id]);
// }

export const saveSystemuserRefreshTokenModel = async (token, userId) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('UPDATE employees SET refresh_token = ? WHERE id = ?', [token, userId]);
    } finally {
        conn.release(); // ✅ Always release the connection
    }
};

export const saveCustomerRefreshTokenModel = async (token, customer_id) => {
    const conn = await pool.getConnection();
    try {
        await conn.query('UPDATE customers SET refresh_token = ? WHERE id = ?', [token, customer_id]);
    } finally {
        conn.release(); // ✅ Always release the connection
    }
};


// export const isRefreshTokenValidModel = async (userId, token) => {
//     const [rows] = await pool.query('SELECT refresh_token FROM employees WHERE id = ?', [userId]);
//     if (rows.length === 0) {
//         return false; // No user found with the provided userId
//     }

//     return rows[0].refresh_token === token;
// };

export const isRefreshTokenValidModel = async (userId, password, token) => {
    // check employees first
    const [empRows] = await pool.query(
        'SELECT refresh_token, password FROM employees WHERE id = ?',
        [userId]
    );
    if (empRows.length > 0) {
        const emp = empRows[0];
        const passwordMatch = await bcrypt.compare(password, emp.password);
        return passwordMatch && emp.refresh_token === token;
    }

    // then check customers
    const [custRows] = await pool.query(
        'SELECT refresh_token, password FROM customers WHERE id = ?',
        [userId]
    );
    if (custRows.length > 0) {
        const cust = custRows[0];
        const passwordMatch = await bcrypt.compare(password, cust.password);
        return passwordMatch && cust.refresh_token === token;
    }

    return false;
};



export const checkEmailModel = async (email) => {
    const [rows] = await pool.query(
        'SELECT email, "employees" AS source_table FROM employees WHERE email = ? UNION SELECT email, "customers" AS source_table FROM customers WHERE email = ?',
        [email, email]
    );
    return rows[0];
};

// export const addOtpModel = async (email, otp, source_table) => {
//     await pool.query(
//         'INSERT INTO otp_store (email, otp, created_at, source_table) VALUES (?, ?, NOW(), ?)',
//         [email, otp, source_table]
//     );
// };

// export const deleteOtpModel = async (email) => {
//     await pool.query('DELETE FROM otp_store WHERE email = ?', [email]);
// };

// export const getOtpByEmailModel = async (email) => {
//     const [rows] = await pool.query('SELECT otp, created_at FROM otp_store WHERE email = ?', [email]);
//     return rows.length > 0 ? rows[0] : null;
// };