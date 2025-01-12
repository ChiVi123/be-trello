import Joi from "joi";
import { ObjectId } from "mongodb";
import { getDB } from "~config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~utils/validators";

const collectionName = "cards";
const collectionSchema = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().optional(),

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

export const cardModel = {
    collectionName,
    collectionSchema,
    createNew,
    findOneById,
};
