import { NextFunction, Request, Response } from "express";
import { boardService } from "~services/board-service";
import { StatusCodes } from "~utils/status-codes";

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.jwtDecoded?._id;
    try {
        const createdBoard = await boardService.createNew(userId, req.body);
        res.status(StatusCodes.CREATED).json(createdBoard);
    } catch (error) {
        next(error);
    }
};
const getDetail = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.jwtDecoded?._id;
    const boardId = req.params.id;
    try {
        const board = await boardService.getDetail(userId, boardId);
        res.status(StatusCodes.OK).json(board);
    } catch (error) {
        next(error);
    }
};
const update = async (req: Request, res: Response, next: NextFunction) => {
    const boardId = req.params.id;
    try {
        const updatedBoard = await boardService.update(boardId, req.body);
        res.status(StatusCodes.OK).json(updatedBoard);
    } catch (error) {
        next(error);
    }
};
const moveCardToAnotherColumn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await boardService.moveCardToAnotherColumn(req.body);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};
const getBoards = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.jwtDecoded?._id;
    const { page, itemsPerPage } = req.query;

    try {
        const result = await boardService.getBoards(userId, page, itemsPerPage);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};

export const boardController = {
    createNew,
    getDetail,
    update,
    moveCardToAnotherColumn,
    getBoards,
};
