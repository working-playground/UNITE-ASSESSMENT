import { Pool, ResultSetHeader } from "mysql2/promise";
import { LeadFilterQueryDto, LeadRow } from "../../common/dto/lead.dto";
import { LeadSource, LeadStatus } from "../../common/enums/common";
import { ILead, LEAD_TABLE_NAME } from "../../models/mysql/leadModel";
import { getMySqlPool } from "./connection";



function mapLeadRow(row: LeadRow): ILead {
    return {
        id: row.id,
        name: row.name,
        phone: row.phone,
        email: row.email,
        status: row.status as LeadStatus,
        source: row.source as LeadSource,
        assignedToUserId: row.assigned_to_user_id,
        imageUrl: row.image_url,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

export async function createLead(
    data: Omit<ILead, "id" | "createdAt" | "updatedAt">
): Promise<ILead> {
    const pool: Pool = getMySqlPool();

    const sql: string = `
    INSERT INTO ${LEAD_TABLE_NAME}
      (name, phone, email, status, source, assigned_to_user_id, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

    const [result] = await pool.query<ResultSetHeader>(sql, [
        data.name,
        data.phone,
        data.email,
        data.status,
        data.source,
        data.assignedToUserId,
        data.imageUrl
    ]);

    const id: number = result.insertId;
    const lead = await findLeadById(id);
    if (!lead) {
        throw new Error("Failed to reload lead after insert");
    }

    return lead;
}

export async function findLeadById(id: number): Promise<ILead | null> {
    const pool: Pool = getMySqlPool();

    const sql: string = `
    SELECT id, name, phone, email, status, source,
           assigned_to_user_id, image_url, created_at, updated_at
    FROM ${LEAD_TABLE_NAME}
    WHERE id = ?
    LIMIT 1
  `;

    const [rows] = await pool.query<LeadRow[]>(sql, [id]);

    if (rows.length === 0) {
        return null;
    }

    return mapLeadRow(rows[0]);
}

export async function findLeadByEmailOrPhone(
    email: string,
    phone: string
): Promise<ILead | null> {
    const pool: Pool = getMySqlPool();

    const sql: string = `
    SELECT id, name, phone, email, status, source,
           assigned_to_user_id, image_url, created_at, updated_at
    FROM ${LEAD_TABLE_NAME}
    WHERE email = ? OR phone = ?
    LIMIT 1
  `;

    const [rows] = await pool.query<LeadRow[]>(sql, [email, phone]);

    if (rows.length === 0) {
        return null;
    }

    return mapLeadRow(rows[0]);
}

export async function updateLead(
    id: number,
    data: Partial<Omit<ILead, "id" | "createdAt" | "updatedAt">>
): Promise<ILead | null> {
    const pool: Pool = getMySqlPool();

    const fields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
        fields.push("name = ?");
        values.push(data.name);
    }
    if (data.phone !== undefined) {
        fields.push("phone = ?");
        values.push(data.phone);
    }
    if (data.email !== undefined) {
        fields.push("email = ?");
        values.push(data.email);
    }
    if (data.status !== undefined) {
        fields.push("status = ?");
        values.push(data.status);
    }
    if (data.source !== undefined) {
        fields.push("source = ?");
        values.push(data.source);
    }
    if (data.assignedToUserId !== undefined) {
        fields.push("assigned_to_user_id = ?");
        values.push(data.assignedToUserId);
    }
    if (data.imageUrl !== undefined) {
        fields.push("image_url = ?");
        values.push(data.imageUrl);
    }

    if (fields.length === 0) {
        const existing = await findLeadById(id);
        return existing;
    }

    const sql: string = `
    UPDATE ${LEAD_TABLE_NAME}
    SET ${fields.join(", ")}
    WHERE id = ?
  `;

    values.push(id);

    await pool.query<ResultSetHeader>(sql, values);

    const updated = await findLeadById(id);
    return updated;
}

export async function deleteLead(id: number): Promise<void> {
    const pool: Pool = getMySqlPool();
    const sql: string = `DELETE FROM ${LEAD_TABLE_NAME} WHERE id = ?`;
    await pool.query<ResultSetHeader>(sql, [id]);
}

export async function listLeads(filters: LeadFilterQueryDto): Promise<ILead[]> {
    const pool: Pool = getMySqlPool();

    const whereParts: string[] = [];
    const values: any[] = [];

    if (filters.status) {
        whereParts.push("status = ?");
        values.push(filters.status);
    }
    if (filters.source) {
        whereParts.push("source = ?");
        values.push(filters.source);
    }
    if (filters.assignedToUserId) {
        whereParts.push("assigned_to_user_id = ?");
        values.push(filters.assignedToUserId);
    }

    const whereClause: string = whereParts.length > 0
        ? "WHERE " + whereParts.join(" AND ")
        : "";

    const sql: string = `
    SELECT id, name, phone, email, status, source,
           assigned_to_user_id, image_url, created_at, updated_at
    FROM ${LEAD_TABLE_NAME}
    ${whereClause}
    ORDER BY created_at DESC
  `;

    const [rows] = await pool.query<LeadRow[]>(sql, values);

    return rows.map(mapLeadRow);
}