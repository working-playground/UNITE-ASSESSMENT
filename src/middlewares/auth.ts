import { NextFunction, Request, Response } from "express";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { UserRole } from "../common/enums/common";

type JwtPayload = {
    userId: number;
    role: string;
};

declare module "express-serve-static-core" {
    interface Request {
        authUser?: JwtPayload;
    }
}

export function requireRole(role: UserRole) {
  return function (req: Request, res: Response, next: NextFunction): void {
    if (!req.authUser || req.authUser.role !== role) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  };
}

export function requireAnyRole(roles: UserRole[]) {
  return function (req: Request, res: Response, next: NextFunction): void {
    if (!req.authUser || roles.indexOf(req.authUser.role as UserRole) === -1) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  };
}


export function signAccessToken(userId: number, role: string): string {
    const secretEnv: string | undefined = process.env.JWT_SECRET;
    const secret: Secret = secretEnv || "changeme";

    const expiresInEnv = process.env.JWT_EXPIRES_IN ? Number(process.env.JWT_EXPIRES_IN) : 3600;
    const payload: JwtPayload = { userId, role };
    const options: SignOptions = { expiresIn: expiresInEnv };

    const token: string = jwt.sign(payload, secret, options);

    return token;
}

export function verifyAccessToken(token: string): JwtPayload {
    const secretEnv: string | undefined = process.env.JWT_SECRET;
    const secret: Secret = secretEnv || "changeme";

    const decoded = jwt.verify(token, secret) as JwtPayload;

    return decoded;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const authHeader: string | undefined = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const token: string = authHeader.substring("Bearer ".length);

    try {
        const payload: JwtPayload = verifyAccessToken(token);
        req.authUser = payload;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}