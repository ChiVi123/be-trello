import { CookieOptions, RequestHandler } from "express";
import ms from "ms";
import { userService } from "~services/user-service";
import ApiError from "~utils/api-error";
import { StatusCodes } from "~utils/status-codes";

const cookieOptions: CookieOptions = { httpOnly: true, secure: true, sameSite: "none", maxAge: ms("14 days") };

const createNew: RequestHandler = async (req, res, next) => {
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

        res.cookie("accessToken", result.accessToken, cookieOptions);
        res.cookie("refreshToken", result.refreshToken, cookieOptions);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};
const logout: RequestHandler = async (req, res, next) => {
    try {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(StatusCodes.OK).json({ loggedOut: true });
    } catch (error) {
        next(error);
    }
};
const refreshToken: RequestHandler = async (req, res, next) => {
    try {
        const result = await userService.refreshToken(req.cookies?.refreshToken);
        res.cookie("accessToken", result.accessToken, cookieOptions);
        res.status(StatusCodes.OK).json(result);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        next(new ApiError(StatusCodes.FORBIDDEN, "Please Sign In! (Error from refresh token)"));
    }
};

export const userController = {
    createNew,
    verify,
    login,
    logout,
    refreshToken,
};
