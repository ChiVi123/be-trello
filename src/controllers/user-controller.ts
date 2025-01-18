import { CookieOptions, NextFunction, Request, RequestHandler, Response } from "express";
import ms from "ms";
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
        const cookieOptions: CookieOptions = { httpOnly: true, secure: true, sameSite: "none", maxAge: ms("14 days") };

        res.cookie("accessToken", result.accessToken, cookieOptions);
        res.cookie("refreshToken", result.refreshToken, cookieOptions);
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
