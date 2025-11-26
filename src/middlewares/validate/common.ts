import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";

function handleValidationResult(
  schema: Schema,
  value: unknown,
  res: Response
): { ok: boolean; value?: any } {
  const result = schema.validate(value, {
    abortEarly: false,
    stripUnknown: true
  });

  if (result.error) {
    res.status(400).json({
      message: "Validation failed",
      details: result.error.details.map(function (d) {
        return d.message;
      })
    });
    return { ok: false };
  }

  return { ok: true, value: result.value };
}

export function validateBody(schema: Schema) {
  return function (req: Request, res: Response, next: NextFunction): void {
    const result = handleValidationResult(schema, req.body, res);
    if (!result.ok) {
      return;
    }
    req.body = result.value;
    next();
  };
}
export function validateQuery(schema: Schema) {
  return function (req: Request, res: Response, next: NextFunction): void {
    const result = handleValidationResult(schema, req.query, res);
    if (!result.ok) {
      return;
    }

    const value = result.value as Record<string, unknown>;

    Object.keys(req.query).forEach(function (key) {
      delete (req.query as any)[key];
    });

    Object.keys(value).forEach(function (key) {
      (req.query as any)[key] = value[key];
    });

    next();
  };
}


export function validateParams(schema: Schema) {
  return function (req: Request, res: Response, next: NextFunction): void {
    const result = handleValidationResult(schema, req.params, res);
    if (!result.ok) {
      return;
    }
    req.params = result.value;
    next();
  };
}
