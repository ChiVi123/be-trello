import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import ApiError from "~utils/api-error";
import { StatusCodes } from "~utils/status-codes";

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    const correctCondition = Joi.object({
        title: Joi.string().required().min(3).max(50).trim().strict().messages({
            "any.required": "[Title]: is required",
            "string.empty": "[Title]: is not allowed to be empty (ChiViDev)",
            "string.min": "[Title]: length must be at least 3 characters long",
            "string.max": "[Title]: length must be less than or equal to 50 characters long",
            "string.trim": "[Title]: not have leading or trailing whitespace",
        }),
        description: Joi.string().required().min(3).max(256).trim().strict(),
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        if (error instanceof Error) {
            next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
        } else {
            next(error);
        }
    }
};

export const boardValidation = {
    createNew,
};