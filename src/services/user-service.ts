import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { userModel } from "~models/user-model";
import ApiError from "~utils/api-error";
import { pickUser } from "~utils/formatters";
import { StatusCodes } from "~utils/status-codes";

const createNew = async (reqBody: Record<string, unknown>) => {
    const email = String(reqBody.email);
    const password = String(reqBody.password);
    const existUser = await userModel.findOneByEmail(email);
    if (existUser) {
        throw new ApiError(StatusCodes.CONFLICT, "Email already exists!");
    }

    const nameFromEmail = email.split("@")[0];
    const newUser = {
        email,
        password: bcryptjs.hashSync(password, 8),
        username: nameFromEmail,
        displayName: nameFromEmail,
        verifyToken: uuidv4(),
    };

    const insertedOneResult = await userModel.createNew(newUser);
    const createdUser = await userModel.findOneById(insertedOneResult.insertedId);
    return pickUser(createdUser);
};

export const userService = {
    createNew,
};
