import { LeadSource, LeadStatus } from "../../common/enums/common";

export const LEAD_TABLE_NAME: string = "leads";

export interface ILead {
    id: number;
    name: string;
    phone: string;
    email: string;
    status: LeadStatus;
    source: LeadSource;
    assignedToUserId: number | null;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export const LEAD_TABLE_SCHEMA: string = `
  CREATE TABLE IF NOT EXISTS ${LEAD_TABLE_NAME} (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL,
    source VARCHAR(32) NOT NULL,
    assigned_to_user_id BIGINT UNSIGNED NULL,
    image_url VARCHAR(512) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_leads_phone (phone),
    UNIQUE KEY uq_leads_email (email)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;