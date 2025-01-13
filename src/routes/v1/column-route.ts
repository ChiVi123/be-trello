import express from "express";
import { columnController } from "~controllers/column-controller";
import { columnValidation } from "~validators/column-validator";

const Router = express.Router();

Router.route("/").post(columnValidation.createNew, columnController.createNew);
Router.route("/:id").put(columnValidation.update, columnController.update);

export const columnRoute = Router;
