import Joi from "joi";

export const dailySummaryQuerySchema = Joi.object({
    date: Joi.number().required()
});