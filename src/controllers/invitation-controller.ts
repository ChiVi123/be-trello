import { NextFunction, Request, Response } from "express";
import { invitationService } from "~services/invitation-service";
import { StatusCodes } from "~utils/status-codes";

const createNewBoardInvitation = async (req: Request, res: Response, next: NextFunction) => {
    const inviterId = req.jwtDecoded?._id;

    try {
        const result = await invitationService.createNewBoardInvitation(inviterId, req.body);
        res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
        next(error);
    }
};

export const invitationController = {
    createNewBoardInvitation,
};
