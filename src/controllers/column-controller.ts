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
const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const columnId = req.params.id;
        const updatedColumn = await columnService.update(columnId, req.body);
        res.status(StatusCodes.OK).json(updatedColumn);
    } catch (error) {
        next(error);
    }
};
const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const columnId = req.params.id;
        const result = await columnService.deleteItem(columnId);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};

export const columnController = {
    createNew,
    update,
    deleteItem,
};
