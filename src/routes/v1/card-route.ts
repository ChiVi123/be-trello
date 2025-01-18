import express from "express";
import { cardController } from "~controllers/card-controller";
import { authMiddleware } from "~middlewares/auth-middleware";
import { cardValidation } from "~validators/card-validator";

const Router = express.Router();

Router.route("/").post(authMiddleware.isAuthorized, cardValidation.createNew, cardController.createNew);

export const cardRoute = Router;
