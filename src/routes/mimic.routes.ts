import { Router } from "express";
import { createMimic, getMimic, recordMimic } from "../controllers/mimic.controller.js";

export const mimicRouter = Router();

mimicRouter.post("/", createMimic);
mimicRouter.get("/:id", getMimic);
mimicRouter.post("/:id", recordMimic);
