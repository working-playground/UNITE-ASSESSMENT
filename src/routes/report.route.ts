import { Router } from "express";
import { UserRole } from "../common/enums/common";
import { getAgentPerformanceController, getDailySummaryController } from "../controller/report.controller";
import { authMiddleware, requireAnyRole } from "../middlewares/auth";
import { validateQuery } from "../middlewares/validate/common";
import { dailySummaryQuerySchema } from "../middlewares/validate/report.validate";

export const reportRouter: Router = Router();

reportRouter.use(authMiddleware);

reportRouter.get(
  "/daily-summary",
  requireAnyRole([UserRole.Admin, UserRole.Manager]),
  validateQuery(dailySummaryQuerySchema),
  getDailySummaryController
);

reportRouter.get(
  "/agent-performance",
  requireAnyRole([UserRole.Admin, UserRole.Manager]),
  getAgentPerformanceController
);