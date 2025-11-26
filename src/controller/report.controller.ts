import { NextFunction, Request, Response } from "express";
import { getAgentPerformanceReport, getDailyCallSummary } from "../service/report.service";

export async function getDailySummaryController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const date: number = Number(req.query.date);
        const summary = await getDailyCallSummary(date);
        res.status(200).json(summary);
    } catch (error) {
        next(error);
    }
}

export async function getAgentPerformanceController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const report = await getAgentPerformanceReport();
        res.status(200).json(report);
    } catch (error) {
        next(error);
    }
}