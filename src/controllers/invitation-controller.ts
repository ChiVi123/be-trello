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
/**
 * Get invitations by user are logged
 */
const getInvitations = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.jwtDecoded?._id;

    try {
        const result = await invitationService.getInvitationsByUserId(userId);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};
const updateBoardInvitation = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.jwtDecoded?._id;
    const { invitationId } = req.params;
    const { status } = req.body;

    try {
        const result = await invitationService.updateBoardInvitation(userId, invitationId, status);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};

export const invitationController = {
    createNewBoardInvitation,
    getInvitations,
    updateBoardInvitation,
};
