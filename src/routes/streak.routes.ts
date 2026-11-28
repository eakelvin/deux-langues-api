import { Router } from "express";
import { getStreak } from "../controllers/streak.controller.js";

export const streakRouter = Router();

streakRouter.get("/", getStreak);
