import { Router } from "express";
import { createWriting, getWriting, submitWriting } from "../controllers/writing.controller.js";

export const writingRouter = Router();

writingRouter.post("/", createWriting);
writingRouter.get("/:id", getWriting);
writingRouter.post("/:id", submitWriting);
