import { NextFunction, Request, Response } from "express";
import { CallTaskFilterQueryDto } from "../common/dto/callTask.dto";
import {
    completeCallTaskService,
    createCallTaskService,
    getCallTaskByIdService,
    listCallTasksService
} from "../service/callTask.service";

export async function createCallTaskController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const task = await createCallTaskService(req.body);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

export async function completeCallTaskController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id: number = Number(req.params.id);
    const agentId: number = req.authUser ? req.authUser.userId : 0;
    const task = await completeCallTaskService(id, req.body, agentId);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

export async function listCallTasksController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const filters: CallTaskFilterQueryDto = {
      leadId: req.query.leadId ? Number(req.query.leadId) : undefined,
      assignedToUserId: req.query.assignedToUserId ? Number(req.query.assignedToUserId) : undefined,
      isCompleted: req.query.isCompleted !== undefined ? req.query.isCompleted === "true" : undefined
    };

    const tasks = await listCallTasksService(filters);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
}

export async function getCallTaskByIdController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id: number = Number(req.params.id);
    const task = await getCallTaskByIdService(id);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}