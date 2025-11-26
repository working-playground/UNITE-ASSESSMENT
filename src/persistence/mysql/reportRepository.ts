import { Pool, RowDataPacket } from "mysql2/promise";
import { CALL_TASK_TABLE_NAME } from "../../models/mysql/callTaskModel";
import { getMySqlPool } from "./connection";

export interface DailySummaryRow extends RowDataPacket {
    assigned_to_user_id: number;
    totalCalls: number;
    completedCalls: number;
    missedCalls: number;
}

export async function fetchDailySummaryRows(
    date: number
): Promise<DailySummaryRow[]> {
    const pool: Pool = getMySqlPool();

    const sql: string = `
    SELECT
      assigned_to_user_id,
      COUNT(*) AS totalCalls,
      SUM(CASE WHEN is_completed = 1 THEN 1 ELSE 0 END) AS completedCalls,
      SUM(CASE WHEN is_completed = 0 THEN 1 ELSE 0 END) AS missedCalls
    FROM ${CALL_TASK_TABLE_NAME}
    WHERE DATE(due_at) = ?
    GROUP BY assigned_to_user_id
  `;
    console.log(date);

    const dateString = new Date(Number(date)).toISOString().slice(0, 10);

    const [rows] = await pool.query<DailySummaryRow[]>(sql, [dateString]);
    return rows;
}