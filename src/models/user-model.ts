import Joi from "joi";
import { ObjectId } from "mongodb";
import { getDB } from "~config/mongodb";
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from "~utils/validators";

enum USER_ROLE {
    CLIENT = "client",
    ADMIN = "admin",
}

interface IUserValidate {
    email: string;
    password: string;
    username: string;
    displayName: string;
    avatar: string;

    role: USER_ROLE;

    isActive: boolean;
    verifyToken?: string | undefined;

    createdAt: number;
    updatedAt: number | null;
    _destroy: boolean;
}

const collectionName = "users";
const collectionSchema = Joi.object<IUserValidate>({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE),
    username: Joi.string().required().trim().strict(),
    displayName: Joi.string().required().trim().strict(),
    avatar: Joi.string().default(null),
    role: Joi.string().valid(USER_ROLE.CLIENT, USER_ROLE.ADMIN).default(USER_ROLE.CLIENT),

    isActive: Joi.boolean().default(false),
    verifyToken: Joi.string(),

    createdAt: Joi.date().timestamp("javascript").default(Date.now),
    updatedAt: Joi.date().timestamp("javascript").default(null),
    _destroy: Joi.boolean().default(false),
});
const invalidUpdateFields = ["_id", "email", "username", "createdAt"];

const validateBeforeCreate = async (data: Record<string, unknown>) => {
    return collectionSchema.validateAsync(data, { abortEarly: false });
};
const createNew = async (data: Record<string, unknown>) => {
    const validData = await validateBeforeCreate(data);
    const createdUser = await getDB().collection(collectionName).insertOne(validData);
    return createdUser;
};
const findOneById = async (id: ObjectId | string) => {
    return getDB()
        .collection(collectionName)
        .findOne({ _id: new ObjectId(id) });
};
const findOneByEmail = async (email: string) => {
    return getDB().collection(collectionName).findOne({ email });
};
const update = async (id: ObjectId | string, updateData: Record<string, unknown>) => {
    Object.keys(updateData).forEach((key) => {
        if (invalidUpdateFields.includes(key)) {
            delete updateData[key];
        }
    });

    return getDB()
        .collection(collectionName)
        .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updateData }, { returnDocument: "after" });
};

export const userModel = { createNew, findOneById, findOneByEmail, update };
