import Joi from "joi";
import { cloneDeep } from "lodash";
import { Collection, Document } from "mongodb";
import { getDB } from "~config/mongodb";

type ModelOptions<T extends Document> = {
    invalidFields?: (keyof T | "_id")[];
    createdAt?: boolean;
    updatedAt?: boolean;
    _destroy?: boolean;
};
type PartialDocument = {
    createdAt?: number;
    updatedAt?: number;
    _destroy?: boolean;
};

export interface IModel<T extends Document> {
    readonly collectionName: string;
    readonly collectionSchema: Joi.ObjectSchema<T>;
    readonly options: ModelOptions<T> | undefined;

    getCollection(): Collection<T>;
    validateBeforeCreate(data: Record<string, unknown>): Promise<T>;
    removeInvalidFields(data: Record<string, unknown>): void;
}

export class Model<T extends Document> implements IModel<T> {
    collectionName: string;
    collectionSchema: Joi.ObjectSchema<T>;
    options: ModelOptions<T> | undefined;

    constructor(name: string, schemaMap: Joi.PartialSchemaMap<T & PartialDocument>, options?: ModelOptions<T>) {
        this.collectionName = name;
        this.options = options;

        const newSchema = cloneDeep(schemaMap);

        if (options?.createdAt) newSchema.createdAt = Joi.date().timestamp("javascript").default(Date.now);
        if (options?.updatedAt) newSchema.updatedAt = Joi.date().timestamp("javascript").default(null);
        if (options?._destroy) newSchema._destroy = Joi.boolean().default(false);

        this.collectionSchema = Joi.object(newSchema);
    }

    public validateBeforeCreate(data: Record<string, unknown>): Promise<T> {
        return this.collectionSchema.validateAsync(data, { abortEarly: false });
    }

    public getCollection(): Collection<T> {
        return getDB().collection<T>(this.collectionName);
    }

    public removeInvalidFields(data: Record<string, unknown>) {
        if (!this.options?.invalidFields) return;

        Object.keys(data).forEach((key) => {
            if (this.options?.invalidFields?.includes(key)) {
                delete data[key];
            }
        });
    }
}
