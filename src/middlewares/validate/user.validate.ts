import Joi from "joi";
import { UserRoleOtherThanAdmin } from "../../common/enums/common";

export const registerUserSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(6).max(128).required(),
    role: Joi.string()
        .valid(...Object.values(UserRoleOtherThanAdmin))
        .required()
});

export const loginUserSchema = Joi.object({
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(6).max(128).required()
});