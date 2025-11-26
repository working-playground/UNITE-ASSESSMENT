import { Router } from "express";
import Joi from "joi";
import { UserRole } from "../common/enums/common";
import {
    createLeadController,
    deleteLeadController,
    getLeadByIdController,
    importLeadCsvController,
    listLeadsController,
    updateLeadController,
    uploadLeadImageController
} from "../controller/lead.controller";
import { authMiddleware, requireAnyRole } from "../middlewares/auth";
import { upload } from "../middlewares/upload";
import { validateBody, validateParams, validateQuery } from "../middlewares/validate/common";
import { createLeadSchema, leadFilterQuerySchema, updateLeadSchema } from "../middlewares/validate/lead.validate";

export const leadRouter: Router = Router();

const idParamSchema = Joi.object({
    id: Joi.number().integer().min(1).required()
});

leadRouter.use(authMiddleware);

leadRouter.post(
    "/",
    requireAnyRole([UserRole.Admin, UserRole.Manager]),
    validateBody(createLeadSchema),
    createLeadController
);

leadRouter.get(
    "/",
    requireAnyRole([UserRole.Admin, UserRole.Manager, UserRole.Agent]),
    validateQuery(leadFilterQuerySchema),
    listLeadsController
);

leadRouter.get(
    "/:id",
    requireAnyRole([UserRole.Admin, UserRole.Manager, UserRole.Agent]),
    validateParams(idParamSchema),
    getLeadByIdController
);

leadRouter.patch(
    "/:id",
    requireAnyRole([UserRole.Admin, UserRole.Manager]),
    validateParams(idParamSchema),
    validateBody(updateLeadSchema),
    updateLeadController
);

leadRouter.delete(
    "/:id",
    requireAnyRole([UserRole.Admin]),
    validateParams(idParamSchema),
    deleteLeadController
);
leadRouter.post(
    "/:id/image",
    requireAnyRole([UserRole.Admin, UserRole.Manager]),
    validateParams(idParamSchema),
    upload.single("file"),
    uploadLeadImageController
);

leadRouter.post(
    "/import/csv",
    requireAnyRole([UserRole.Admin, UserRole.Manager]),
    upload.single("file"),
    importLeadCsvController
);