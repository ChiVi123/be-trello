import Joi from "joi";
import { ObjectId, WithId } from "mongodb";
import { getDB } from "~config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~utils/validators";

interface IColumnValidate {
    boardId: string;
    title: string;
    cardOrderIds: string[];

    createdAt: number;
    updatedAt: number | null;
    _destroy: boolean;
}
type ColumnDocument = Document & { boardId: ObjectId; cards: unknown[] };

const collectionName = "columns";
const collectionSchema = Joi.object<IColumnValidate>({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(50).trim().strict(),
    cardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),

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
        .insertOne({ ...validData, boardId: new ObjectId(validData.boardId) });
};
const findOneById = async (id: ObjectId | string | undefined) => {
    return getDB()
        .collection<ColumnDocument>(collectionName)
        .findOne({ _id: new ObjectId(id) });
};
const pushCardOrderIds = async (card: WithId<{ columnId: ObjectId | string }>) => {
    return getDB()
        .collection<ColumnDocument>(collectionName)
        .findOneAndUpdate(
            { _id: new ObjectId(card.columnId) },
            { $push: { cardOrderIds: new ObjectId(card._id) } },
            { returnDocument: "after" },
        );
};
const update = async (id: string, updateData: Record<string, unknown>) => {
    Object.keys(updateData).forEach((key) => {
        if (invalidUpdateFields.includes(key)) {
            delete updateData[key];
        }
    });

    return getDB()
        .collection<ColumnDocument>(collectionName)
        .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updateData }, { returnDocument: "after" });
};

export const columnModel = {
    collectionName,
    collectionSchema,
    createNew,
    findOneById,
    pushCardOrderIds,
    update,
};
