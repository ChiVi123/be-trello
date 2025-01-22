import { boardModel } from "~models/board-model";
import { invitationModel } from "~models/invitation-model";
import { userModel } from "~models/user-model";
import ApiError from "~utils/api-error";
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from "~utils/constants";
import { pickUser } from "~utils/formatters";
import { StatusCodes } from "~utils/status-codes";

const createNewBoardInvitation = async (inviterId: string, reqBody: Record<string, string>) => {
    const inviter = await userModel.findOneById(inviterId);
    const invitee = await userModel.findOneByEmail(reqBody.inviteeEmail);
    const board = await boardModel.findOneById(reqBody.boardId);

    if (!inviter || !invitee || !board) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Inviter, Invitee or Board not found!!!");
    }

    const newInvitation = {
        inviterId,
        inviteeId: invitee._id.toString(),
        type: INVITATION_TYPES.BOARD,
        boardInvitation: {
            boardId: board._id.toString(),
            status: BOARD_INVITATION_STATUS.PENDING,
        },
    };

    const insertedOneResult = await invitationModel.createNewBoardInvitation(newInvitation);
    const getInvitation = await invitationModel.findOneById(insertedOneResult.insertedId);

    return {
        ...getInvitation,
        board,
        inviter: pickUser(inviter),
        invitee: pickUser(invitee),
    };
};
const getInvitationsByUserId = async (userId: string) => {
    const getInvitation = await invitationModel.findByUserId(userId);
    const resInvitation = getInvitation.map((item) => ({
        ...item,
        inviter: item.inviter[0] ?? {},
        invitee: item.invitee[0] ?? {},
        board: item.board[0] ?? {},
    }));

    return resInvitation;
};

export const invitationService = {
    createNewBoardInvitation,
    getInvitationsByUserId,
};
