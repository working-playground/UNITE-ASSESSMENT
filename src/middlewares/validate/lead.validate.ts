import Joi from "joi";
import { LeadSource, LeadStatus } from "../../common/enums/common";

export const createLeadSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    phone: Joi.string().min(5).max(32).required(),
    email: Joi.string().email().max(255).required(),
    status: Joi.string()
        .valid(...Object.values(LeadStatus))
        .required(),
    source: Joi.string()
        .valid(...Object.values(LeadSource))
        .required(),
    assignedToUserId: Joi.number().integer().min(1).allow(null),
    imageUrl: Joi.string().uri().max(512).allow(null)
});

export const updateLeadSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    phone: Joi.string().min(5).max(32),
    email: Joi.string().email().max(255),
    status: Joi.string().valid(...Object.values(LeadStatus)),
    source: Joi.string().valid(...Object.values(LeadSource)),
    assignedToUserId: Joi.number().integer().min(1).allow(null),
    imageUrl: Joi.string().uri().max(512).allow(null)
}).min(1);

export const leadFilterQuerySchema = Joi.object({
    status: Joi.string().valid(...Object.values(LeadStatus)),
    source: Joi.string().valid(...Object.values(LeadSource)),
    assignedToUserId: Joi.number().integer().min(1)
});
