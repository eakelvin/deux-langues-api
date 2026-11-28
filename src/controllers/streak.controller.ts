import type { RequestHandler } from "express";
import { streakService } from "../services/streak.service.js";

export const getStreak: RequestHandler = async (_req, res) => {
  const streak = await streakService.get();
  res.json(streak);
};
