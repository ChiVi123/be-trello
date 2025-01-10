import { Request, Response } from "express";
import { StatusCodes } from "~utils/status-codes";

const createNew = async (req: Request, res: Response) => {
    try {
        res.status(StatusCodes.CREATED).json({ message: "API create new board!!!" });
    } catch (error) {
        if (error instanceof Error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }
};

export const boardController = {
    createNew,
};
