import { Router } from "express";
import { userRouter } from "./user.routes.js";
import { conversationRouter } from "./conversation.routes.js";
import { mimicRouter } from "./mimic.routes.js";
import { notesRouter } from "./notes.routes.js";
import { progressRouter } from "./progress.routes.js";
import { reviewRouter } from "./review.routes.js";
import { streakRouter } from "./streak.routes.js";
import { writingRouter } from "./writing.routes.js";

export const router = Router();

router.use("/users", userRouter);
router.use("/writing", writingRouter);
router.use("/streak", streakRouter);
router.use("/notes", notesRouter);
router.use("/reviews", reviewRouter);
router.use("/progress", progressRouter);
router.use("/mimic", mimicRouter);
router.use("/conversations", conversationRouter);
