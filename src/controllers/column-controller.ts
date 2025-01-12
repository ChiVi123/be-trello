import { NextFunction, Request, Response } from "express";
import { columnService } from "~services/column-service";
import { StatusCodes } from "~utils/status-codes";

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createdColumn = await columnService.createNew(req.body);
        res.status(StatusCodes.CREATED).json(createdColumn);
    } catch (error) {
        next(error);
    }
};

export const columnController = {
    createNew,
};
