import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import ApiError from "~utils/api-error";
import { StatusCodes } from "~utils/status-codes";
import { ALLOW_COMMON_FILE_TYPES, LIMIT_COMMON_FILE_SIZE } from "~utils/validators";

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
        const errMessage = "File type is invalid. Only accept jpg, jpeg, png and webp";
        return cb(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errMessage));
    }

    return cb(null, true);
};
const upload = multer({
    limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
    fileFilter,
});

export const multerMiddleware = { upload };
