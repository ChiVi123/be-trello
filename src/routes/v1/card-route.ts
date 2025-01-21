import express from "express";
import { cardController } from "~controllers/card-controller";
import { authMiddleware } from "~middlewares/auth-middleware";
import { multerMiddleware } from "~middlewares/multer-middleware";
import { cardValidation } from "~validators/card-validator";

const Router = express.Router();

Router.route("/").post(authMiddleware.isAuthorized, cardValidation.createNew, cardController.createNew);
Router.route("/:id").put(
    authMiddleware.isAuthorized,
    multerMiddleware.upload.single("cardCover"),
    cardValidation.update,
    cardController.update,
);

export const cardRoute = Router;
