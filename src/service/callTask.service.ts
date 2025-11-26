import {
    CallTaskFilterQueryDto,
    CompleteCallTaskDto,
    CreateCallTaskDto
} from "../common/dto/callTask.dto";
import { createError } from "../common/errors/simpleError";
import { ICallTask } from "../models/mysql/callTaskModel";
import { createCallLog } from "../persistence/mongo/callLogRepository";
import {
    completeCallTask,
    createCallTask,
    findCallTaskById,
    listCallTasks
} from "../persistence/mysql/callTaskRepository";
import { sendTaskAssignedNotification, sendTaskCompletedNotification } from "./notification.service";

export async function createCallTaskService(
    dto: CreateCallTaskDto
): Promise<ICallTask> {
    const task = await createCallTask({
        leadId: dto.leadId,
        assignedToUserId: dto.assignedToUserId,
        dueAt: dto.dueAt || null,
        idempotencyKey: dto.idempotencyKey || null
    });

    await sendTaskAssignedNotification(
        "AGENT_PHONE_PLACEHOLDER",
        "New call task assigned for lead " + task.leadId
    );

    return task;
}

export async function completeCallTaskService(
    id: number,
    dto: CompleteCallTaskDto,
    agentId: number
): Promise<ICallTask> {
    const existing = await findCallTaskById(id);
    if (!existing) {
        throw createError(404, "Call task not found", "CALL_TASK_NOT_FOUND");
    }

    if (existing.isCompleted) {
        return existing;
    }

    const updated = await completeCallTask(id, dto.outcome, dto.notes || null);

    if (!updated) {
        throw createError(404, "Call task not found", "CALL_TASK_NOT_FOUND");
    }

    await createCallLog({
        callTaskId: updated.id,
        leadId: updated.leadId,
        agentId,
        outcome: dto.outcome,
        notes: dto.notes || null,
        createdAt: new Date()
    });

    await sendTaskCompletedNotification(
        "AGENT_PHONE_PLACEHOLDER",
        "Call task completed for lead " + updated.leadId
    );

    return updated;
}

export async function listCallTasksService(
    filters: CallTaskFilterQueryDto
): Promise<ICallTask[]> {
    const tasks = await listCallTasks(filters);
    return tasks;
}

export async function getCallTaskByIdService(id: number): Promise<ICallTask> {
    const task = await findCallTaskById(id);
    if (!task) {
        throw createError(404, "Call task not found", "CALL_TASK_NOT_FOUND");
    }
    return task;
}

