import Joi from "joi";
import { ObjectId, WithId } from "mongodb";
import { getDB } from "~config/mongodb";
import { pagingSkipValue } from "~utils/algorithms";
import { BOARD_TYPES } from "~utils/constants";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~utils/validators";
import { cardModel } from "./card-model";
import { columnModel } from "./column-model";
import { userModel } from "./user-model";

type BoardDocument = Document & { columnOrderIds: ObjectId[] };

const collectionName = "boards";
const collectionSchema = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    slug: Joi.string().required().min(3).trim().strict(),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string()
        .valid(...Object.values(BOARD_TYPES))
        .required(),

    columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),

    ownerIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
    memberIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),

    createdAt: Joi.date().timestamp("javascript").default(Date.now),
    updatedAt: Joi.date().timestamp("javascript").default(null),
    _destroy: Joi.boolean().default(false),
});
const invalidUpdateFields = ["_id", "createdAt"];

const validateBeforeCreate = async (data: Record<string, unknown>) => {
    return collectionSchema.validateAsync(data, { abortEarly: false });
};
const createNew = async (userId: string | ObjectId, data: Record<string, unknown>) => {
    const validData = await validateBeforeCreate(data);
    const newBoard = { ...validData, ownerIds: [new ObjectId(userId)] };
    return getDB().collection(collectionName).insertOne(newBoard);
};
const findOneById = async (id: ObjectId | string | undefined) => {
    return getDB()
        .collection(collectionName)
        .findOne({ _id: new ObjectId(id) });
};
const getDetail = async (userId: string | ObjectId, boardId: ObjectId | string | undefined) => {
    const queryConditions = [
        { _id: new ObjectId(boardId) },
        { _destroy: false },
        { $or: [{ ownerIds: { $all: [new ObjectId(userId)] } }, { memberIds: { $all: [new ObjectId(userId)] } }] },
    ];
    const result = await getDB()
        .collection(collectionName)
        .aggregate([
            { $match: { $and: queryConditions } },
            {
                $lookup: {
                    from: columnModel.collectionName,
                    localField: "_id",
                    foreignField: "boardId",
                    as: "columns",
                },
            },
            {
                $lookup: {
                    from: cardModel.collectionName,
                    localField: "_id",
                    foreignField: "boardId",
                    as: "cards",
                },
            },
            {
                $lookup: {
                    from: userModel.collectionName,
                    localField: "ownerIds",
                    foreignField: "_id",
                    as: "owners",
                    // pipeline to run on joined collection
                    // Passes along the documents with the requested fields to the next stage in the pipeline
                    // false or 0 (the exclusion of a field)
                    pipeline: [{ $project: { password: 0, verifyToken: 0 } }],
                },
            },
            {
                $lookup: {
                    from: userModel.collectionName,
                    localField: "memberIds",
                    foreignField: "_id",
                    as: "members",
                    pipeline: [{ $project: { password: 0, verifyToken: 0 } }],
                },
            },
        ])
        .toArray();
    return result[0] || null;
};
const pushColumnOrderIds = async (column: WithId<{ boardId: ObjectId | string }>) => {
    return getDB()
        .collection<BoardDocument>(collectionName)
        .findOneAndUpdate(
            { _id: new ObjectId(column.boardId) },
            { $push: { columnOrderIds: new ObjectId(column._id) } },
            { returnDocument: "after" },
        );
};
const update = async (id: string, updateData: Record<string, unknown>) => {
    Object.keys(updateData).forEach((key) => {
        if (invalidUpdateFields.includes(key)) {
            delete updateData[key];
        }
    });

    if (updateData?.columnOrderIds && Array.isArray(updateData?.columnOrderIds)) {
        updateData.columnOrderIds = updateData.columnOrderIds.map((id) => new ObjectId(String(id)));
    }

    return getDB()
        .collection<BoardDocument>(collectionName)
        .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updateData }, { returnDocument: "after" });
};
const pullColumnOrderIds = async (column: WithId<{ boardId: ObjectId | string }>) => {
    return getDB()
        .collection<BoardDocument>(collectionName)
        .findOneAndUpdate(
            { _id: new ObjectId(column.boardId) },
            { $pull: { columnOrderIds: new ObjectId(column._id) } },
            { returnDocument: "after" },
        );
};
const getBoards = async (userId: string | ObjectId, page: number, itemsPerPage: number) => {
    const queryConditions = [
        { _destroy: false },
        { $or: [{ ownerIds: { $all: [new ObjectId(userId)] } }, { memberIds: { $all: [new ObjectId(userId)] } }] },
    ];
    const query = await getDB()
        .collection(collectionName)
        .aggregate(
            [
                { $match: { $and: queryConditions } },
                { $sort: { title: 1 } },
                {
                    $facet: {
                        queryBoards: [{ $skip: pagingSkipValue(page, itemsPerPage) }, { $limit: itemsPerPage }],
                        queryTotalBoards: [{ $count: "countedAllBoards" }],
                    },
                },
            ],
            // https://www.mongodb.com/docs/v6.0/reference/collation/#std-label-collation-document-fields
            { collation: { locale: "en" } },
        )
        .toArray();

    const res = query[0];
    return {
        boards: res.queryBoards ?? [],
        totalBoards: res.queryTotalBoards[0]?.countedAllBoards ?? 0,
    };
};

export const boardModel = {
    collectionName,
    collectionSchema,
    createNew,
    findOneById,
    getDetail,
    pushColumnOrderIds,
    update,
    pullColumnOrderIds,
    getBoards,
};
