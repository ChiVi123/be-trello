import { CorsOptions } from "cors";
import { env } from "~config/environment";
import ApiError from "~utils/api-error";
import { StatusCodes } from "~utils/status-codes";

export const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        // Accept API are called in mode dev, (Regular case using POSTMAN, origin is set an undefined)
        if (env.BUILD_MODE === "development") {
            return callback(null, true);
        }

        if (origin && env.CORS_WHITELIST_ORIGINS.includes(origin)) {
            return callback(null, true);
        }

        // Domain is rejected
        return callback(new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`));
    },
    // Some legacy browsers (IE11, various SmartTVs) choke on 204
    optionsSuccessStatus: 200,
    // CORS accept receive cookies from request
    credentials: true,
};
