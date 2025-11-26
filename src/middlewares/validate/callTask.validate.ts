import Joi from "joi";
import { CallOutcome } from "../../common/enums/common";

export const createCallTaskSchema = Joi.object({
    leadId: Joi.number().integer().min(1).required(),
    assignedToUserId: Joi.number().integer().min(1).required(),
    dueAt: Joi.date().optional(),
    idempotencyKey: Joi.string().max(128).optional()
});

export const completeCallTaskSchema = Joi.object({
    outcome: Joi.string()
        .valid(...Object.values(CallOutcome))
        .required(),
    notes: Joi.string().allow("", null).optional(),
    idempotencyKey: Joi.string().max(128).optional()
});

export const callTaskFilterQuerySchema = Joi.object({
    leadId: Joi.number().integer().min(1),
    assignedToUserId: Joi.number().integer().min(1),
    isCompleted: Joi.boolean()
});