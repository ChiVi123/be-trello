import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import ApiError from "~utils/api-error";
import { StatusCodes } from "~utils/status-codes";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~utils/validators";

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    const correctCondition = Joi.object({
        boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        title: Joi.string().required().min(3).max(50).trim().strict(),
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

export const columnValidation = {
    createNew,
};
