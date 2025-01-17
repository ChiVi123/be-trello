import Joi from "joi";
import { ObjectId, OptionalId } from "mongodb";
import { IModel, Model } from "~models/model";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~utils/validators";

export interface ICardDocument {
    boardId: string | ObjectId;
    columnId: string | ObjectId;

    title: string;
    description: string;

    createdAt: number;
    updatedAt: number | null;
    _destroy: boolean;
}

class CardModel {
    private model: IModel<ICardDocument>;
    private name: string;

    constructor(model: IModel<ICardDocument>) {
        this.model = model;
        this.name = model.collectionName;
    }

    public get collectionName(): string {
        return this.name;
    }

    public async create(data: OptionalId<ICardDocument>) {
        const validData = await this.model.validateBeforeCreate(data);
        return this.model.getCollection().insertOne({
            ...validData,
            boardId: new ObjectId(validData.boardId),
            columnId: new ObjectId(validData.columnId),
        });
    }

    public async findOneById(id: ObjectId | string | undefined) {
        return this.model.getCollection().findOne({ _id: new ObjectId(id) });
    }

    public async update(id: string, updateData: Record<string, unknown>) {
        this.model.removeInvalidFields(updateData);

        if (updateData.columnId) updateData.columnId = new ObjectId(String(updateData.columnId));

        return this.model
            .getCollection()
            .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updateData }, { returnDocument: "after" });
    }

    public async deleteManyByColumnId(columnId: string) {
        return this.model.getCollection().deleteMany({ columnId: new ObjectId(columnId) });
    }
}

const schema = {
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().optional(),
};
const model = new Model<ICardDocument>("cards", schema, {
    invalidFields: ["_id", "boardId", "createdAt"],
    createdAt: true,
    updatedAt: true,
    _destroy: true,
});

export const cardModel = new CardModel(model);
