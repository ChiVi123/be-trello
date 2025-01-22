import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import ApiError from "~utils/api-error";
import { StatusCodes } from "~utils/status-codes";

const createNewBoardInvitation = async (req: Request, res: Response, next: NextFunction) => {
    const correctCondition = Joi.object({
        inviteeEmail: Joi.string().required(),
        boardId: Joi.string().required(),
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

export const invitationValidation = {
    createNewBoardInvitation,
};
