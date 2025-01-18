import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { env } from "~config/environment";
import { userModel } from "~models/user-model";
import { BrevoProvider } from "~providers/brevo-provider";
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

    const url = new URL("account/verification", env.WEBSITE_DOMAIN);
    const searchParams = new URLSearchParams({ email: createdUser?.email, token: createdUser?.verifyToken });

    url.search = searchParams.toString();

    const verificationLink = url.href;
    const customSubject = "Trello: Please verify your email before using our service";
    const htmlContent = `
        <h3>Here is your verification link:</h3>
        <h3>${verificationLink}</h3>
        <h3>Sincerely,<br/>- ChiVi - Software Developer -</h3>
    `;

    await BrevoProvider.sendEmail(createdUser?.email, customSubject, htmlContent);

    return pickUser(createdUser);
};

export const userService = {
    createNew,
};
