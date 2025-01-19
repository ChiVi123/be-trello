import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { env } from "~config/environment";
import { JwtProvider } from "~providers/jwt-provider";
import ApiError from "~utils/api-error";
import { StatusCodes } from "~utils/status-codes";

declare module "express" {
    interface Request {
        jwtDecoded?: JwtPayload;
    }
}

const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
    const clientAccessToken = req.cookies?.accessToken;
    if (!clientAccessToken) {
        next(new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized! (Token not found)"));
        return;
    }

    try {
        const accessTokenDecoded = await JwtProvider.verifyToken(clientAccessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE);
        req.jwtDecoded = accessTokenDecoded as JwtPayload;
        next();
    } catch (error) {
        if (error instanceof Error && error.message.includes("jwt expired")) {
            next(new ApiError(StatusCodes.GONE, "Need to refresh token"));
        } else {
            next(new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized!"));
        }
    }
};

export const authMiddleware = { isAuthorized };
