import { Pool, ResultSetHeader } from "mysql2/promise";
import { UserRow } from "../../common/dto/user.dto";
import { UserRole } from "../../common/enums/common";
import { USER_TABLE_NAME } from "../../models/mysql/userModel";
import { getMySqlPool } from "./connection";

function mapUserRowToUser(row: UserRow) {
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        passwordHash: row.password_hash,
        role: row.role as UserRole,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

export async function createUser(
    name: string,
    email: string,
    passwordHash: string,
    role: UserRole
) {
    const pool: Pool = getMySqlPool();

    const insertSql: string = `
    INSERT INTO ${USER_TABLE_NAME} (name, email, password_hash, role)
    VALUES (?, ?, ?, ?)
  `;

    const [result] = await pool.query<ResultSetHeader>(insertSql, [
        name,
        email,
        passwordHash,
        role
    ]);

    const insertedId: number = result.insertId;

    const user = await findUserById(insertedId);
    if (!user) {
        throw new Error("Failed to load user after insert");
    }

    return user;
}

export async function findUserByEmail(email: string) {
    const pool: Pool = getMySqlPool();

    const selectSql: string = `
    SELECT id, name, email, password_hash, role, created_at, updated_at
    FROM ${USER_TABLE_NAME}
    WHERE email = ?
    LIMIT 1
  `;

    const [rows] = await pool.query<UserRow[]>(selectSql, [email]);

    if (rows.length === 0) {
        return null;
    }

    const row: UserRow = rows[0];
    return mapUserRowToUser(row);
}

export async function findUserById(id: number) {
    const pool: Pool = getMySqlPool();

    const selectSql: string = `
    SELECT id, name, email, password_hash, role, created_at, updated_at
    FROM ${USER_TABLE_NAME}
    WHERE id = ?
    LIMIT 1
  `;

    const [rows] = await pool.query<UserRow[]>(selectSql, [id]);

    if (rows.length === 0) {
        return null;
    }

    const row: UserRow = rows[0];
    return mapUserRowToUser(row);
}
 