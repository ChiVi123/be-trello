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
const updateBoardInvitation = async (userId: string, invitationId: string, status: BOARD_INVITATION_STATUS) => {
    const getInvitation = await invitationModel.findOneById(invitationId);
    if (!getInvitation) throw new ApiError(StatusCodes.NOT_FOUND, "Invitation not found!!!");

    const boardId = getInvitation.boardInvitation?.boardId;
    const getBoard = await boardModel.findOneById(boardId);
    if (!getBoard) throw new ApiError(StatusCodes.NOT_FOUND, "Board not found!!!");

    const boardOwnerAndMemberIds = [...getBoard.ownerIds, ...getBoard.memberIds].toString();

    if (status === BOARD_INVITATION_STATUS.ACCEPTED && boardOwnerAndMemberIds.includes(userId)) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "You are already a member of this board!!!");
    }

    const updateData = {
        boardInvitation: {
            ...getInvitation.boardInvitation,
            status,
        },
        createdAt: Date.now(),
    };

    const updatedInvitation = await invitationModel.update(invitationId, updateData);

    if (status === BOARD_INVITATION_STATUS.ACCEPTED) {
        await boardModel.pushMemberIds(boardId, userId);
    }

    return updatedInvitation;
};

export const invitationService = {
    createNewBoardInvitation,
    getInvitationsByUserId,
    updateBoardInvitation,
};
