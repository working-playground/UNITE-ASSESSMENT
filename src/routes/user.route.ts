import { Router } from "express";
import { loginHandler, registerHandler } from "../controller/user.controller";
import { validateBody } from "../middlewares/validate/common";
import { loginUserSchema, registerUserSchema } from "../middlewares/validate/user.validate";

export const userRouter: Router = Router();

userRouter.post("/register", validateBody(registerUserSchema), registerHandler);
userRouter.post("/login", validateBody(loginUserSchema), loginHandler);