import { RowDataPacket } from "mysql2/promise";
import { CallOutcome } from "../enums/common";

export interface CallTaskRow extends RowDataPacket {
    id: number;
    lead_id: number;
    assigned_to_user_id: number;
    due_at: Date | null;
    is_completed: number;
    outcome: string | null;
    notes: string | null;
    idempotency_key: string | null;
    completed_at: Date | null;
    created_at: Date;
    updated_at: Date;
}

export type CreateCallTaskDto = {
    leadId: number;
    assignedToUserId: number;
    dueAt?: Date | null;
    idempotencyKey?: string | null;
};

export type CompleteCallTaskDto = {
    outcome: CallOutcome;
    notes?: string | null;
    idempotencyKey?: string | null;
};

export type CallTaskFilterQueryDto = {
    leadId?: number;
    assignedToUserId?: number;
    isCompleted?: boolean;
};
