import { NextFunction, Request, RequestHandler, Response } from "express";
import { userService } from "~services/user-service";
import { StatusCodes } from "~utils/status-codes";

const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createdUser = await userService.createNew(req.body);
        res.status(StatusCodes.CREATED).json(createdUser);
    } catch (error) {
        next(error);
    }
};
const verify: RequestHandler = async (req, res, next) => {
    try {
        const result = await userService.verify(req.body);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};
const login: RequestHandler = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);

        console.log("🚀 ~ login ~ result:", result);

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};

export const userController = {
    createNew,
    verify,
    login,
};
