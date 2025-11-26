import { RowDataPacket } from "mysql2";
import { LeadSource, LeadStatus } from "../enums/common";

export type CreateLeadDto = {
    name: string;
    phone: string;
    email: string;
    status: LeadStatus;
    source: LeadSource;
    assignedToUserId?: number | null;
    imageUrl?: string | null;
};

export type UpdateLeadDto = {
    name?: string;
    phone?: string;
    email?: string;
    status?: LeadStatus;
    source?: LeadSource;
    assignedToUserId?: number | null;
    imageUrl?: string | null;
};

export type LeadFilterQueryDto = {
    status?: LeadStatus;
    source?: LeadSource;
    assignedToUserId?: number;
};

export type LeadRow = RowDataPacket & {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: string;
  source: string;
  assigned_to_user_id: number | null;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
};