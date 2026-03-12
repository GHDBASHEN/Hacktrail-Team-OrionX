import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const createSuperAdmin = async () => {
    const employee_id = 'ADMIN001';
    const password = 'adminpassword';
    const role = 'super_admin';
    const status = 'active';

    console.log('Connecting to database with:');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`DB: ${process.env.DB_NAME}`);

    const pool = mysql.createPool({
        host: process.env.DB_HOST.trim(),
        port: process.env.DB_PORT.trim(),
        user: process.env.DB_USER.trim(),
        password: process.env.DB_PASSWORD.trim(),
        database: process.env.DB_NAME.trim(),
        waitForConnections: true,
        connectionLimit: 1,
        queueLimit: 0
    });

    try {
        const [existing] = await pool.query('SELECT * FROM systemuser WHERE employee_id = ?', [employee_id]);
        if (existing.length > 0) {
            console.log(`User with employee_id ${employee_id} already exists.`);
            await pool.end();
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            "INSERT INTO systemuser (password, role, status, employee_id) VALUES (?, ?, ?, ?)",
            [hashedPassword, role, status, employee_id]
        );

        console.log('Super admin created successfully!');
        console.log(`Employee ID: ${employee_id}`);
        console.log(`Password: ${password}`);
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('Error creating super admin:', error);
        await pool.end();
        process.exit(1);
    }
};

createSuperAdmin();
