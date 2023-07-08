import joi from "joi";

export const schemaTransaction = joi.object({
    value: joi.number().positive().required(),
    description: joi.string().required(),
});