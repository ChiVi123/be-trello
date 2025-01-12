import express from "express";
import { columnController } from "~controllers/column-controller";
import { columnValidation } from "~validators/column-validator";

const Router = express.Router();

Router.route("/").post(columnValidation.createNew, columnController.createNew);

export const columnRoute = Router;