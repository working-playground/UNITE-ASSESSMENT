import bcrypt from "bcrypt";
import { Pool, RowDataPacket } from "mysql2/promise";
import { getMySqlPool } from "./connection";

export async function initMySqlSchema(): Promise<void> {
    const pool: Pool = getMySqlPool();

    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

    // 2) Create leads table
    await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      status VARCHAR(50) NOT NULL,
      source VARCHAR(50) NOT NULL,
      assigned_to_user_id INT NULL,
      image_url VARCHAR(500) NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

    // 3) Create call_tasks table
    await pool.query(`
    CREATE TABLE IF NOT EXISTS call_tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      lead_id INT NOT NULL,
      assigned_to_user_id INT NOT NULL,
      due_at DATETIME NOT NULL,
      is_completed TINYINT(1) NOT NULL DEFAULT 0,
      completed_at DATETIME NULL,
      outcome VARCHAR(50) NULL,
      notes TEXT NULL,
      idempotency_key VARCHAR(255) UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

    // 4) Ensure admin user exists
    const adminEmail = process.env.ADMIN_EMAIL || "admin@demo.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [adminEmail]
    );

    if (rows.length === 0) {
        const hash = await bcrypt.hash(adminPassword, 10);

        await pool.query(
            `
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `,
            ["Admin User", adminEmail, hash, "admin"]
        );

        console.log(`Seeded admin user: ${adminEmail} / ${adminPassword}`);
    } else {
        console.log(`Admin user already exists: ${adminEmail}`);
    }
}
