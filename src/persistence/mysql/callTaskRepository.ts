import { Pool, ResultSetHeader } from "mysql2/promise";
import { CallTaskFilterQueryDto, CallTaskRow } from "../../common/dto/callTask.dto";
import { CallOutcome } from "../../common/enums/common";
import { CALL_TASK_TABLE_NAME, ICallTask } from "../../models/mysql/callTaskModel";
import { getMySqlPool } from "./connection";

function mapCallTaskRow(row: CallTaskRow): ICallTask {
    return {
        id: row.id,
        leadId: row.lead_id,
        assignedToUserId: row.assigned_to_user_id,
        dueAt: row.due_at,
        isCompleted: row.is_completed === 1,
        outcome: row.outcome as CallOutcome | null,
        notes: row.notes,
        idempotencyKey: row.idempotency_key,
        completedAt: row.completed_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

export async function findCallTaskById(id: number): Promise<ICallTask | null> {
    const pool: Pool = getMySqlPool();

    const sql: string = `
    SELECT id, lead_id, assigned_to_user_id, due_at, is_completed,
           outcome, notes, idempotency_key, completed_at,
           created_at, updated_at
    FROM ${CALL_TASK_TABLE_NAME}
    WHERE id = ?
    LIMIT 1
  `;

    const [rows] = await pool.query<CallTaskRow[]>(sql, [id]);

    if (rows.length === 0) {
        return null;
    }

    return mapCallTaskRow(rows[0]);
}

export async function findCallTaskByIdempotencyKey(
    idempotencyKey: string
): Promise<ICallTask | null> {
    const pool: Pool = getMySqlPool();

    const sql: string = `
    SELECT id, lead_id, assigned_to_user_id, due_at, is_completed,
           outcome, notes, idempotency_key, completed_at,
           created_at, updated_at
    FROM ${CALL_TASK_TABLE_NAME}
    WHERE idempotency_key = ?
    LIMIT 1
  `;

    const [rows] = await pool.query<CallTaskRow[]>(sql, [idempotencyKey]);

    if (rows.length === 0) {
        return null;
    }

    return mapCallTaskRow(rows[0]);
}

export async function createCallTask(
    data: {
        leadId: number;
        assignedToUserId: number;
        dueAt: Date | null;
        idempotencyKey: string | null;
    }
): Promise<ICallTask> {
    const pool: Pool = getMySqlPool();

    if (data.idempotencyKey) {
        const existing = await findCallTaskByIdempotencyKey(data.idempotencyKey);
        if (existing) {
            return existing;
        }
    }

    const sql: string = `
    INSERT INTO ${CALL_TASK_TABLE_NAME}
      (lead_id, assigned_to_user_id, due_at, idempotency_key)
    VALUES (?, ?, ?, ?)
  `;

    const [result] = await pool.query<ResultSetHeader>(sql, [
        data.leadId,
        data.assignedToUserId,
        data.dueAt,
        data.idempotencyKey
    ]);

    const id: number = result.insertId;
    const created = await findCallTaskById(id);

    if (!created) {
        throw new Error("Failed to reload call task after insert");
    }

    return created;
}

export async function completeCallTask(
    id: number,
    outcome: CallOutcome,
    notes: string | null
): Promise<ICallTask | null> {
    const pool: Pool = getMySqlPool();

    const sql: string = `
    UPDATE ${CALL_TASK_TABLE_NAME}
    SET is_completed = 1,
        outcome = ?,
        notes = ?,
        completed_at = NOW()
    WHERE id = ?
      AND is_completed = 0
  `;

    await pool.query<ResultSetHeader>(sql, [outcome, notes, id]);

    const updated = await findCallTaskById(id);
    return updated;
}

export async function listCallTasks(
    filters: CallTaskFilterQueryDto
): Promise<ICallTask[]> {
    const pool: Pool = getMySqlPool();

    const whereParts: string[] = [];
    const values: any[] = [];

    if (filters.leadId !== undefined) {
        whereParts.push("lead_id = ?");
        values.push(filters.leadId);
    }
    if (filters.assignedToUserId !== undefined) {
        whereParts.push("assigned_to_user_id = ?");
        values.push(filters.assignedToUserId);
    }
    if (filters.isCompleted !== undefined) {
        whereParts.push("is_completed = ?");
        values.push(filters.isCompleted ? 1 : 0);
    }

    const whereClause: string =
        whereParts.length > 0 ? "WHERE " + whereParts.join(" AND ") : "";

    const sql: string = `
    SELECT id, lead_id, assigned_to_user_id, due_at, is_completed,
           outcome, notes, idempotency_key, completed_at,
           created_at, updated_at
    FROM ${CALL_TASK_TABLE_NAME}
    ${whereClause}
    ORDER BY created_at DESC
  `;

    const [rows] = await pool.query<CallTaskRow[]>(sql, values);

    return rows.map(function (row: CallTaskRow): ICallTask {
        return mapCallTaskRow(row);
    });
}
