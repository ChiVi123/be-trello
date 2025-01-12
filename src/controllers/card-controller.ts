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

export const cardController = {
    createNew,
};
