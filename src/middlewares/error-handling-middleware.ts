/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { env } from "~config/environment";
import ApiError from "~utils/api-error";
import { StatusCodes } from "~utils/status-codes";

type ResponseError = {
    statusCode: StatusCodes;
    message: string | 500 | "INTERNAL_SERVER_ERROR";
    stack?: string | undefined;
};

// Middleware error handling into app's Back-end NodeJS (ExpressJS)
export const errorHandlingMiddleware = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

    const responseError: ResponseError = {
        statusCode: err.statusCode,
        message: err.message || StatusCodes[err.statusCode],
    };
    // console.error(responseError)

    // Only DEV mode has Stack Trace to debug.
    if (env.BUILD_MODE === "development") responseError.stack = err.stack;

    // Do something like: Error Log into file, throw to group Slack, Telegram, Email...vv.
    // ...

    res.status(responseError.statusCode).json(responseError);
};
