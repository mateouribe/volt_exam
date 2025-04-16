import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    await connection.query(`
         CREATE TABLE IF NOT EXISTS books (
           id INT AUTO_INCREMENT PRIMARY KEY,
           title VARCHAR(255) NOT NULL,
           author_id VARCHAR(100) NOT NULL,
           published_year INT NOT NULL,
         )
       `);

    connection.release();
    // console.log("Database started successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

export default pool;
