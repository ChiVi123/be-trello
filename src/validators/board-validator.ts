import { Request, Response } from "express";
import Joi from "joi";
import { StatusCodes } from "~utils/status-codes";

const createNew = async (req: Request, res: Response) => {
    const correctCondition = Joi.object({
        title: Joi.string().required().min(3).max(50).trim().strict().messages({
            "any.required": "Title is required",
            "string.empty": "Title is not allowed to be empty (ChiViDev)",
            "string.min": "Title length must be at least 3 characters long",
            "string.max": "Title length must be less than or equal to 50 characters long",
            "string.trim": "Title not have leading or trailing whitespace",
        }),
        description: Joi.string().required().min(3).max(256).trim().strict(),
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });
        res.status(StatusCodes.CREATED).json({ message: "API create new board!!!" });
    } catch (error) {
        if (error instanceof Error) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: error.message });
        }
    }
};

export const boardValidation = {
    createNew,
};
