import express from "express";
import { boardController } from "~controllers/board-controller";
import { authMiddleware } from "~middlewares/auth-middleware";
import { boardValidation } from "~validators/board-validator";

const Router = express.Router();

Router.route("/")
    .get(authMiddleware.isAuthorized, boardController.getBoards)
    .post(authMiddleware.isAuthorized, boardValidation.createNew, boardController.createNew);

Router.route("/:id")
    .get(authMiddleware.isAuthorized, boardController.getDetail)
    .put(authMiddleware.isAuthorized, boardValidation.update, boardController.update);

Router.route("/supports/moving-cards").put(
    authMiddleware.isAuthorized,
    boardValidation.moveCardToAnotherColumn,
    boardController.moveCardToAnotherColumn,
);

export const boardRoute = Router;
