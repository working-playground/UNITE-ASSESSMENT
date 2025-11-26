import { NextFunction, Request, Response } from "express";
import { AppError } from "../common/errors/simpleError";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  const appError = err as AppError;

  const statusCode: number = appError.statusCode || 500;
  const message: string = appError.message || "Internal server error";

  res.status(statusCode).json({
    message,
    code: appError.code
  });
}
