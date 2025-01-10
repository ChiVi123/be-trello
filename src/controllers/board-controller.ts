import { NextFunction, Request, Response } from "express";
import ApiError from "~utils/api-error";
import { StatusCodes } from "~utils/status-codes";

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // res.status(StatusCodes.CREATED).json({ message: "API create new board!!!" });
        throw new ApiError(StatusCodes.BAD_REQUEST, "Test error");
    } catch (error) {
        next(error);
    }
};

export const boardController = {
    createNew,
};
