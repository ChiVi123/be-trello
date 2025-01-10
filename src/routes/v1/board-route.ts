import { Router } from "express";
import { StatusCodes } from "~utils/status-codes";

const router = Router();

router
    .route("/")
    .get((res, req) => {
        req.status(StatusCodes.OK).json({ message: "API list board!!!", statusCode: StatusCodes.OK });
    })
    .post((res, req) => {
        req.status(StatusCodes.CREATED).json({ message: "API create new board!!!", statusCode: StatusCodes.CREATED });
    });

export const boardRoute = router;
