import { Router } from "express";
import Joi from "joi";
import { UserRole } from "../common/enums/common";
import {
    completeCallTaskController,
    createCallTaskController,
    getCallTaskByIdController,
    listCallTasksController
} from "../controller/callTask.controller";
import { authMiddleware, requireAnyRole } from "../middlewares/auth";

import { callTaskFilterQuerySchema, completeCallTaskSchema, createCallTaskSchema } from "../middlewares/validate/callTask.validate";
import { validateBody, validateParams, validateQuery } from "../middlewares/validate/common";

export const callTaskRouter: Router = Router();

const idParamSchema = Joi.object({
    id: Joi.number().integer().min(1).required()
});

callTaskRouter.use(authMiddleware);

callTaskRouter.post(
    "/",
    requireAnyRole([UserRole.Admin, UserRole.Manager]),
    validateBody(createCallTaskSchema),
    createCallTaskController
);

callTaskRouter.post(
    "/:id/complete",
    requireAnyRole([UserRole.Agent, UserRole.Manager, UserRole.Admin]),
    validateParams(idParamSchema),
    validateBody(completeCallTaskSchema),
    completeCallTaskController
);

callTaskRouter.get(
    "/",
    requireAnyRole([UserRole.Admin, UserRole.Manager, UserRole.Agent]),
    validateQuery(callTaskFilterQuerySchema),
    listCallTasksController
);

callTaskRouter.get(
    "/:id",
    requireAnyRole([UserRole.Admin, UserRole.Manager, UserRole.Agent]),
    validateParams(idParamSchema),
    getCallTaskByIdController
);
