import express from "express";
import { boardController } from "~controllers/board-controller";
import { boardValidation } from "~validators/board-validator";

const Router = express.Router();

Router.route("/").post(boardValidation.createNew, boardController.createNew);

Router.route("/:id").get(boardController.getDetail).put(boardValidation.update, boardController.update);

Router.route("/supports/moving-cards").put(
    boardValidation.moveCardToAnotherColumn,
    boardController.moveCardToAnotherColumn,
);

export const boardRoute = Router;
