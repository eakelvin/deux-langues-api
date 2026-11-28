import { Router } from "express";
import { getProgress } from "../controllers/progress.controller.js";

export const progressRouter = Router();

progressRouter.get("/", getProgress);
