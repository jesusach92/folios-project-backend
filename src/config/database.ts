import mysql from "mysql2/promise";
import dotenv from "dotenv";
import logger from "./logger";

dotenv.config();

let pool: mysql.Pool;

export async function initializeDatabase(): Promise<void> {
  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "production_control",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    const connection = await pool.getConnection();
    logger.info("✓ Database connection successful", {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME
    });
    connection.release();
  } catch (error) {
    logger.error("✗ Database connection failed:", error);
    throw error;
  }
}

export function getPool(): mysql.Pool {
  if (!pool) {
    throw new Error("Database pool not initialized");
  }
  return pool;
}

export async function closeDatabaseConnection(): Promise<void> {
  if (pool) {
    await pool.end();
    logger.info("Database connection closed");
  }
}
