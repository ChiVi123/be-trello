import { NextFunction, Request, Response } from "express";
import { boardModel } from "~models/board-model";
import { boardService } from "~services/board-service";
import { StatusCodes } from "~utils/status-codes";

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const insertedOneResult = await boardService.createNew(req.body);
        const createdBoard = await boardModel.findOneById(insertedOneResult.insertedId);
        res.status(StatusCodes.CREATED).json(createdBoard);
    } catch (error) {
        next(error);
    }
};
const getDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boardId = req.params.id;
        const board = await boardService.getDetail(boardId);
        res.status(StatusCodes.OK).json(board);
    } catch (error) {
        next(error);
    }
};

export const boardController = {
    createNew,
    getDetail,
};
