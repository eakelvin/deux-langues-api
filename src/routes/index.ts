import { Router } from "express";
import { userRouter } from "./user.routes.js";
import { conversationRouter } from "./conversation.routes.js";
import { mimicRouter } from "./mimic.routes.js";
import { writingRouter } from "./writing.routes.js";

export const router = Router();

router.use("/users", userRouter);
router.use("/writing", writingRouter);
router.use("/mimic", mimicRouter);
router.use("/conversations", conversationRouter);
