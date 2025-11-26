import { CallOutcome } from "../../common/enums/common";

export const CALL_TASK_TABLE_NAME: string = "call_tasks";

export interface ICallTask {
    id: number;
    leadId: number;
    assignedToUserId: number;
    dueAt: Date | null;
    isCompleted: boolean;
    outcome: CallOutcome | null;
    notes: string | null;
    idempotencyKey: string | null;
    createdAt: Date;
    updatedAt: Date;
    completedAt: Date | null;
}

export const CALL_TASK_TABLE_SCHEMA: string = `
  CREATE TABLE IF NOT EXISTS ${CALL_TASK_TABLE_NAME} (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    lead_id BIGINT UNSIGNED NOT NULL,
    assigned_to_user_id BIGINT UNSIGNED NOT NULL,
    due_at DATETIME NULL,
    is_completed TINYINT(1) NOT NULL DEFAULT 0,
    outcome VARCHAR(64) NULL,
    notes TEXT NULL,
    idempotency_key VARCHAR(128) NULL,
    completed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_call_tasks_idempotency (idempotency_key)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

