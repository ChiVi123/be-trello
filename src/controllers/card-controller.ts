import { NextFunction, Request, Response } from "express";
import { cardService } from "~services/card-service";
import { StatusCodes } from "~utils/status-codes";

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createdCard = await cardService.createNew(req.body);
        res.status(StatusCodes.CREATED).json(createdCard);
    } catch (error) {
        next(error);
    }
};
const update = async (req: Request, res: Response, next: NextFunction) => {
    const cardId = req.params.id;
    const cardCoverFile = req.file;
    const userInfo = req.jwtDecoded;

    try {
        const createdCard = await cardService.update(cardId, req.body, cardCoverFile, userInfo);
        res.status(StatusCodes.OK).json(createdCard);
    } catch (error) {
        next(error);
    }
};

export const cardController = {
    createNew,
    update,
};
