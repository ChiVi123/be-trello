import { Router } from "express";
import { boardRoute } from "./board-route";
import { cardRoute } from "./card-route";
import { columnRoute } from "./column-route";
import { invitationRoute } from "./invitation-route";
import { userRoute } from "./user-route";

const router = Router();

router.use("/boards", boardRoute);
router.use("/columns", columnRoute);
router.use("/cards", cardRoute);

router.use("/users", userRoute);

router.use("/invitations", invitationRoute);

export const apisV1 = router;
