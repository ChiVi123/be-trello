import { StatusCodes } from "./status-codes";

class ApiError extends Error {
    public statusCode: StatusCodes;

    constructor(statusCode: StatusCodes, message: string) {
        super(message);

        // Reassign property name of Error
        this.name = "ApiError";
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;
