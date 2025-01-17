import express from "express";
import { userController } from "~controllers/user-controller";
import { userValidation } from "~validators/user-validator";

const Router = express.Router();

Router.route("/register").post(userValidation.createNew, userController.createNew);

export const userRoute = Router;
