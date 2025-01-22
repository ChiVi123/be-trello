import Joi from "joi";
import { ObjectId } from "mongodb";
import { getDB } from "~config/mongodb";
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from "~utils/constants";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~utils/validators";
import { boardModel } from "./board-model";
import { userModel } from "./user-model";

interface IInvitationModel {
    /** user inviting */
    inviterId: string | ObjectId;
    /** user are invited */
    inviteeId: string | ObjectId;

    type: INVITATION_TYPES;

    boardInvitation?: {
        boardId: string | ObjectId;
        status: BOARD_INVITATION_STATUS;
    };

    createdAt: number;
    updatedAt: number | null;
    _destroy: boolean;
}

const collectionName = "invitations";
const collectionSchema = Joi.object<IInvitationModel>({
    inviterId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    inviteeId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

    type: Joi.string()
        .required()
        .valid(...Object.values(INVITATION_TYPES)),

    boardInvitation: Joi.object({
        boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        status: Joi.string()
            .required()
            .valid(...Object.values(BOARD_INVITATION_STATUS)),
    }).optional(),

    createdAt: Joi.date().timestamp("javascript").default(Date.now),
    updatedAt: Joi.date().timestamp("javascript").default(null),
    _destroy: Joi.boolean().default(false),
});
const invalidUpdateFields: (keyof (IInvitationModel & { _id: ObjectId }))[] = [
    "_id",
    "inviterId",
    "inviteeId",
    "type",
    "createdAt",
];

const validateBeforeCreate = async (data: Record<string, unknown>) => {
    return collectionSchema.validateAsync(data, { abortEarly: false });
};
const createNewBoardInvitation = async (data: Record<string, unknown>) => {
    const validData = await validateBeforeCreate(data);
    const newInvitationToAdd = {
        ...validData,
        inviterId: new ObjectId(validData.inviterId),
        inviteeId: new ObjectId(validData.inviteeId),
    };

    if (newInvitationToAdd.boardInvitation?.boardId) {
        newInvitationToAdd.boardInvitation = {
            ...newInvitationToAdd.boardInvitation,
            boardId: new ObjectId(newInvitationToAdd.boardInvitation.boardId),
        };
    }

    return getDB().collection(collectionName).insertOne(newInvitationToAdd);
};
const findOneById = async (id: ObjectId | string | undefined) => {
    return getDB()
        .collection<IInvitationModel>(collectionName)
        .findOne({ _id: new ObjectId(id) });
};
const update = async (id: string, updateData: Record<string, unknown>) => {
    Object.keys(updateData).forEach((key) => {
        if (invalidUpdateFields.includes(key as keyof IInvitationModel)) {
            delete updateData[key as keyof IInvitationModel];
        }
    });

    if (
        updateData?.boardInvitation &&
        typeof updateData.boardInvitation === "object" &&
        "boardId" in updateData.boardInvitation
    ) {
        updateData.boardInvitation = {
            ...updateData.boardInvitation,
            boardId: new ObjectId(updateData.boardInvitation.boardId as string),
        };
    }

    return getDB()
        .collection<IInvitationModel>(collectionName)
        .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updateData }, { returnDocument: "after" });
};
const findByUserId = (userId: string | ObjectId) => {
    const queryConditions = [
        // user were invited, exactly query invitations
        { inviteeId: new ObjectId(userId) },
        { _destroy: false },
    ];
    return getDB()
        .collection(collectionName)
        .aggregate([
            { $match: { $and: queryConditions } },
            {
                $lookup: {
                    from: userModel.collectionName,
                    localField: "inviterId",
                    foreignField: "_id",
                    as: "inviter",
                    pipeline: [{ $project: { password: 0, verifyToken: 0 } }],
                },
            },
            {
                $lookup: {
                    from: userModel.collectionName,
                    localField: "inviteeId",
                    foreignField: "_id",
                    as: "invitee",
                    pipeline: [{ $project: { password: 0, verifyToken: 0 } }],
                },
            },
            {
                $lookup: {
                    from: boardModel.collectionName,
                    localField: "boardInvitation.boardId",
                    foreignField: "_id",
                    as: "board",
                },
            },
        ])
        .toArray();
};

export const invitationModel = {
    collectionName,
    collectionSchema,
    createNewBoardInvitation,
    findOneById,
    update,
    findByUserId,
};
