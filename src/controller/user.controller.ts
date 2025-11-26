import { NextFunction, Request, Response } from "express";
import { UserRole } from "../common/enums/common";
import { loginUser, registerUser } from "../service/user.service";


export async function registerHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const name: string = req.body.name;
        const email: string = req.body.email;
        const password: string = req.body.password;
        const roleValue: string = req.body.role;

        if (!name || !email || !password || !roleValue) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        if (!Object.values(UserRole).includes(roleValue as UserRole)) {
            res.status(400).json({ message: "Invalid role" });
            return;
        }

        const result = await registerUser({
            name,
            email,
            password,
            role: roleValue as UserRole
        });

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

export async function loginHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const email: string = req.body.email;
        const password: string = req.body.password
        const result = await loginUser({ email, password });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

