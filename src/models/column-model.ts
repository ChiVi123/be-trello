import Joi from "joi";
import { ObjectId, OptionalId, WithId } from "mongodb";
import { IModel, Model } from "~models/model";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~utils/validators";
import { ICardDocument } from "./card-model";

export interface IColumnDocument {
    boardId: ObjectId | string;
    title: string;
    cardOrderIds: (ObjectId | string)[];

    cards?: ICardDocument[];

    createdAt: number;
    updatedAt: number | null;
    _destroy: boolean;
}

class ColumnModel {
    private model: IModel<IColumnDocument>;
    private name: string;

    constructor(model: IModel<IColumnDocument>) {
        this.model = model;
        this.name = model.collectionName;
    }

    public get collectionName(): string {
        return this.name;
    }

    public async create(data: OptionalId<IColumnDocument>) {
        const validData = await this.model.validateBeforeCreate(data);
        return this.model.getCollection().insertOne({ ...validData, boardId: new ObjectId(validData.boardId) });
    }

    public async findOneById(id: ObjectId | string | undefined) {
        return this.model.getCollection().findOne({ _id: new ObjectId(id) });
    }

    public async update(id: string, updateData: Record<string, unknown>) {
        this.model.removeInvalidFields(updateData);

        if (updateData?.cardOrderIds && Array.isArray(updateData?.cardOrderIds)) {
            updateData.cardOrderIds = updateData.cardOrderIds.map((id) => new ObjectId(String(id)));
        }

        return this.model
            .getCollection()
            .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updateData }, { returnDocument: "after" });
    }

    public async pushCardOrderIds(card: WithId<{ columnId: ObjectId | string }>) {
        return this.model
            .getCollection()
            .findOneAndUpdate(
                { _id: new ObjectId(card.columnId) },
                { $push: { cardOrderIds: new ObjectId(card._id) } },
                { returnDocument: "after" },
            );
    }

    public async deleteOnById(id: ObjectId | string | undefined) {
        return this.model.getCollection().deleteOne({ _id: new ObjectId(id) });
    }
}

const schema = {
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(50).trim().strict(),
    cardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
};
const model = new Model<IColumnDocument>("columns", schema, {
    invalidFields: ["_id", "boardId", "createdAt"],
    createdAt: true,
    updatedAt: true,
    _destroy: true,
});

export const columnModel = new ColumnModel(model);
