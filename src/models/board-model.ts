import Joi from "joi";
import { ObjectId } from "mongodb";
import { getDB } from "~config/mongodb";
import { BOARD_TYPES } from "~utils/constants";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~utils/validators";
import { cardModel } from "./card-model";
import { columnModel } from "./column-model";

const collectionName = "boards";
const collectionSchema = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    slug: Joi.string().required().min(3).trim().strict(),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),

    columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
    createdAt: Joi.date().timestamp("javascript").default(Date.now),
    updatedAt: Joi.date().timestamp("javascript").default(null),
    _destroy: Joi.boolean().default(false),
});

const validateBeforeCreate = async (data: Record<string, unknown>) => {
    return collectionSchema.validateAsync(data, { abortEarly: false });
};
const createNew = async (data: Record<string, unknown>) => {
    const validData = await validateBeforeCreate(data);
    return getDB().collection(collectionName).insertOne(validData);
};
const findOneById = async (id: ObjectId | string | undefined) => {
    return getDB()
        .collection(collectionName)
        .findOne({ _id: new ObjectId(id) });
};
const getDetail = async (id: ObjectId | string | undefined) => {
    const result = await getDB()
        .collection(collectionName)
        .aggregate([
            { $match: { _id: new ObjectId(id), _destroy: false } },
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
        ])
        .toArray();
    return result[0] || null;
};

export const boardModel = {
    collectionName,
    collectionSchema,
    createNew,
    findOneById,
    getDetail,
};
