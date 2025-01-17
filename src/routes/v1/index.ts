import { Router } from "express";
import { boardRoute } from "~routes/v1/board-route";
import { cardRoute } from "~routes/v1/card-route";
import { columnRoute } from "~routes/v1/column-route";
import { userRoute } from "~routes/v1/user-route";

const router = Router();

router.use("/boards", boardRoute);
router.use("/columns", columnRoute);
router.use("/cards", cardRoute);

router.use("/users", userRoute);

export const apisV1 = router;
