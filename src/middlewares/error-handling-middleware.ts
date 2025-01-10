/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import ApiError from "~utils/api-error";
import { StatusCodes } from "~utils/status-codes";
// import { env } from '~/config/environment'

// Middleware error handling into app's Back-end NodeJS (ExpressJS)
export const errorHandlingMiddleware = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

    const responseError = {
        statusCode: err.statusCode,
        message: err.message || StatusCodes[err.statusCode],
        stack: err.stack,
    };
    // console.error(responseError)

    // Only DEV mode has Stack Trace to debug.
    // if (env.BUILD_MODE !== 'dev') delete responseError.stack

    // Do something like: Error Log into file, throw to group Slack, Telegram, Email...vv.
    // ...

    res.status(responseError.statusCode).json(responseError);
};
