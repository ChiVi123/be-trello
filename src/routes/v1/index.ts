import { Router } from "express";
import { boardRoute } from "~routes/v1/board-route";

const router = Router();

router.use("/boards", boardRoute);

export const apisV1 = router;
