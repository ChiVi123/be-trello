import { NextFunction, Request, Response } from "express";
import { boardService } from "~services/board-service";
import { StatusCodes } from "~utils/status-codes";

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createdBoard = await boardService.createNew(req.body);
        res.status(StatusCodes.CREATED).json(createdBoard);
    } catch (error) {
        next(error);
    }
};

export const boardController = {
    createNew,
};
