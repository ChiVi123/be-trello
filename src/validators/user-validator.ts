import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import ApiError from "~utils/api-error";
import { StatusCodes } from "~utils/status-codes";
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from "~utils/validators";

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    const correctCondition = Joi.object({
        email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
        password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE),
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(error instanceof Error ? new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message) : error);
    }
};

export const userValidation = {
    createNew,
};
