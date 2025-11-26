import { RowDataPacket } from "mysql2/promise";
import { UserRole } from "../enums/common";

export interface UserRow extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    role: string;
    created_at: Date;
    updated_at: Date;
}

export type UserSummaryDto = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
};

export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResultDto {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
}