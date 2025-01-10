import { Router } from "express";
import { boardController } from "~controllers/board-controller";
import { StatusCodes } from "~utils/status-codes";
import { boardValidation } from "~validators/board-validator";

const router = Router();

router
    .route("/")
    .get((req, res) => {
        res.status(StatusCodes.OK).json({ message: "API list board!!!", statusCode: StatusCodes.OK });
    })
    .post(boardValidation.createNew, boardController.createNew);

export const boardRoute = router;
