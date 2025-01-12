import express from "express";
import { boardController } from "~controllers/board-controller";
import { StatusCodes } from "~utils/status-codes";
import { boardValidation } from "~validators/board-validator";

const Router = express.Router();

Router.route("/")
    .get((_req, res) => {
        res.status(StatusCodes.OK).json({ message: "API list board!!!", statusCode: StatusCodes.OK });
    })
    .post(boardValidation.createNew, boardController.createNew);

Router.route("/:id").get(boardController.getDetail).put(boardValidation.update, boardController.update);

export const boardRoute = Router;
