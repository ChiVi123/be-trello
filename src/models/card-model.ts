import Joi from "joi";
import { ObjectId } from "mongodb";
import { getDB } from "~config/mongodb";
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~utils/validators";

interface ICardValidate {
    boardId: string;
    columnId: string;

    title: string;
    description: string;

    cover: string;
    memberIds: (string | ObjectId)[];
    comments: {
        userId: string | ObjectId;
        userEmail: string;
        userAvatar: string;
        userDisplayName: string;
        content: string;
        commentedAt: number;
    }[];

    createdAt: number;
    updatedAt: number | null;
    _destroy: boolean;
}
type CardDocument = Document & { boardId: ObjectId; columnId: ObjectId };

const collectionName = "cards";
const collectionSchema = Joi.object<ICardValidate>({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().optional(),

    cover: Joi.string().default(null),
    memberIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
    comments: Joi.array()
        .items({
            userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
            userEmail: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
            userAvatar: Joi.string(),
            userDisplayName: Joi.string(),
            content: Joi.string(),
            commentedAt: Joi.date().timestamp(),
        })
        .default([]),

    createdAt: Joi.date().timestamp("javascript").default(Date.now),
    updatedAt: Joi.date().timestamp("javascript").default(null),
    _destroy: Joi.boolean().default(false),
});
const invalidUpdateFields = ["boardId", "_id", "createdAt"];

const validateBeforeCreate = async (data: Record<string, unknown>) => {
    return collectionSchema.validateAsync(data, { abortEarly: false });
};
const createNew = async (data: Record<string, unknown>) => {
    const validData = await validateBeforeCreate(data);
    return getDB()
        .collection(collectionName)
        .insertOne({
            ...validData,
            boardId: new ObjectId(validData.boardId),
            columnId: new ObjectId(validData.columnId),
        });
};
const findOneById = (id: ObjectId | string | undefined) => {
    return getDB()
        .collection<CardDocument>(collectionName)
        .findOne({ _id: new ObjectId(id) });
};
const update = async (id: string, updateData: Record<string, unknown>) => {
    Object.keys(updateData).forEach((key) => {
        if (invalidUpdateFields.includes(key)) {
            delete updateData[key];
        }
    });

    if (updateData.columnId) updateData.columnId = new ObjectId(String(updateData.columnId));

    return getDB()
        .collection<CardDocument>(collectionName)
        .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updateData }, { returnDocument: "after" });
};
const deleteManyByColumnId = (columnId: string) => {
    return getDB()
        .collection<CardDocument>(collectionName)
        .deleteMany({ columnId: new ObjectId(columnId) });
};
const unshiftNewComment = (cardId: string, commentData: Record<string, unknown>) => {
    return getDB()
        .collection<CardDocument>(collectionName)
        .findOneAndUpdate(
            { _id: new ObjectId(cardId) },
            { $push: { comments: { $each: [commentData], $position: 0 } } },
            { returnDocument: "after" },
        );
};

export const cardModel = {
    collectionName,
    collectionSchema,
    createNew,
    findOneById,
    update,
    deleteManyByColumnId,
    unshiftNewComment,
};
