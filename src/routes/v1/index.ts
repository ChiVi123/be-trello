import { Router } from "express";
import { boardRoute } from "./board-route";
import { cardRoute } from "./card-route";
import { columnRoute } from "./column-route";

const router = Router();

router.use("/boards", boardRoute);
router.use("/columns", columnRoute);
router.use("/cards", cardRoute);

export const apisV1 = router;
