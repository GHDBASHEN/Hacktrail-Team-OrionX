import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000, // 10-second connection timeout
  });

  // Test connection immediately
  const testConn = await pool.getConnection();
  await testConn.ping();
  testConn.release();
  
  console.log('🔌 Connected to local MySQL successfully!');

  // Add keep-alive every 4 minutes (240000ms)
  setInterval(async () => {
    try {
      const keepAliveConn = await pool.getConnection();
      await keepAliveConn.query('SELECT 1');
      keepAliveConn.release();
      console.log('🫀 Database keep-alive successful');
    } catch (keepAliveErr) {
      console.error('❌ Database keep-alive failed:', keepAliveErr.message);
    }
  }, 240000);

} catch (error) {
  console.error('❌ Local MySQL connection FAILED:', error.message);
  process.exit(1); // Exit process on DB connection failure
}

export default pool;