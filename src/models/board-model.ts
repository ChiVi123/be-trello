import Joi from "joi";
import { ObjectId, OptionalId, WithId } from "mongodb";
import { cardModel } from "~models/card-model";
import { columnModel } from "~models/column-model";
import { IModel, Model } from "~models/model";
import { BOARD_TYPES } from "~utils/constants";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~utils/validators";

export interface IBoardDocument {
    title: string;
    slug: string;
    description: string;
    type: BOARD_TYPES;

    columnOrderIds: ObjectId[];

    createdAt: number;
    updatedAt: number | null;
    _destroy: boolean;
}

class BoardModel {
    private model: IModel<IBoardDocument>;
    private name: string;

    constructor(model: IModel<IBoardDocument>) {
        this.model = model;
        this.name = model.collectionName;
    }

    public get collectionName(): string {
        return this.name;
    }

    public async create(data: OptionalId<IBoardDocument>) {
        const validData = await this.model.validateBeforeCreate(data);
        return this.model.getCollection().insertOne(validData);
    }

    public async findOneById(id: ObjectId | string | undefined) {
        return this.model.getCollection().findOne({ _id: new ObjectId(id) });
    }

    public async getDetail(id: ObjectId | string | undefined) {
        const result = await this.model
            .getCollection()
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
        return result[0] ?? null;
    }

    public async update(id: string, updateData: Record<string, unknown>) {
        this.model.removeInvalidFields(updateData);

        if (updateData?.columnOrderIds && Array.isArray(updateData?.columnOrderIds)) {
            updateData.columnOrderIds = updateData.columnOrderIds.map((id) => new ObjectId(String(id)));
        }

        return this.model
            .getCollection()
            .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updateData }, { returnDocument: "after" });
    }

    public async pushColumnOrderIds(column: WithId<{ boardId: ObjectId | string }>) {
        return this.model
            .getCollection()
            .findOneAndUpdate(
                { _id: new ObjectId(column.boardId) },
                { $push: { columnOrderIds: new ObjectId(column._id) } },
                { returnDocument: "after" },
            );
    }

    public async pullColumnOrderIds(column: WithId<{ boardId: ObjectId | string }>) {
        return this.model
            .getCollection()
            .findOneAndUpdate(
                { _id: new ObjectId(column.boardId) },
                { $pull: { columnOrderIds: new ObjectId(column._id) } },
                { returnDocument: "after" },
            );
    }
}

const schema = {
    title: Joi.string().required().min(3).max(50).trim().strict(),
    slug: Joi.string().required().min(3).trim().strict(),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),

    columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
};
const model = new Model<IBoardDocument>("boards", schema, {
    invalidFields: ["_id", "createdAt"],
    createdAt: true,
    updatedAt: true,
    _destroy: true,
});

export const boardModel = new BoardModel(model);
