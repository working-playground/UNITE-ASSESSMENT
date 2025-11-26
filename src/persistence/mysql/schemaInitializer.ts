import { Pool } from "mysql2/promise";
import { LEAD_TABLE_SCHEMA } from "../../models/mysql/leadModel";
import { USER_TABLE_SCHEMA } from "../../models/mysql/userModel";
import { getMySqlPool } from "./connection";
import { CALL_TASK_TABLE_SCHEMA } from "../../models/mysql/callTaskModel";

export async function initializeMySqlSchema(): Promise<void> {
    const pool: Pool = getMySqlPool();

    await pool.query(USER_TABLE_SCHEMA);
    await pool.query(LEAD_TABLE_SCHEMA);
    await pool.query(CALL_TASK_TABLE_SCHEMA);

    console.log("MySQL schema initialized");
}