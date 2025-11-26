import { Router } from "express";
import { UserRole } from "../common/enums/common";
import { authMiddleware, requireAnyRole } from "../middlewares/auth";
import { upload } from "../middlewares/upload";
import { csvHandler } from "../utils/csv.handler.service";

export const csvImportRouter: Router = Router();

csvImportRouter.use(authMiddleware);

csvImportRouter.post(
    "/lead",
    requireAnyRole([UserRole.Admin, UserRole.Manager]),
    upload.single("file"),
    csvHandler
);
