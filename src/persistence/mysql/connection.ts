import { createPool, Pool } from "mysql2/promise";
import { getConfig } from "../../config/env";

let pool: Pool | null = null;

export function getMySqlPool(): Pool {
    if (pool === null) {
        const config = getConfig();

        pool = createPool({
            host: config.mysqlHost,
            port: config.mysqlPort,
            user: config.mysqlUser,
            password: config.mysqlPassword,
            database: config.mysqlDatabase,
            connectionLimit: 10
        });
    }

    return pool;
}

export async function testMySqlConnection(): Promise<void> {
    const currentPool: Pool = getMySqlPool();
    const connection = await currentPool.getConnection();

    try {
        await connection.query("SELECT 1");
        console.log("MySQL connection OK");
    } finally {
        connection.release();
    }
}