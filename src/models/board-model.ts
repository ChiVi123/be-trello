import Joi from "joi";
import { Condition, ObjectId } from "mongodb";
import { getDB } from "~config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~utils/validators";

const collectionName = "boards";
const collectionSchema = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    slug: Joi.string().required().min(3).trim().strict(),
    description: Joi.string().required().min(3).max(256).trim().strict(),

    columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
    createdAt: Joi.date().timestamp("javascript").default(Date.now),
    updatedAt: Joi.date().timestamp("javascript").default(null),
    _destroy: Joi.boolean().default(false),
});

const createNew = async (data: Record<string, unknown>) => {
    return getDB().collection(collectionName).insertOne(data);
};
const findOneById = async (id: Condition<ObjectId> | undefined) => {
    return getDB().collection(collectionName).findOne({ _id: id });
};

export const boardModel = {
    collectionName,
    collectionSchema,
    createNew,
    findOneById,
};
