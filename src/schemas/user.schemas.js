import joi from "joi";

export const schemaTransaction = joi.object({
    value: joi.number().positive().required(),
    description: joi.string().required(),
});

export const schemaDeleteTransaction = joi.object({
    id: joi.number().positive().required(),
});