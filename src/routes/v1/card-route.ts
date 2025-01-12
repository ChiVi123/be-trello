import express from "express";
import { cardController } from "~controllers/card-controller";
import { cardValidation } from "~validators/card-validator";

const Router = express.Router();

Router.route("/").post(cardValidation.createNew, cardController.createNew);

export const cardRoute = Router;
