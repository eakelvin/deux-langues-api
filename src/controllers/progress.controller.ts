import type { RequestHandler } from "express";
import { progressService } from "../services/progress/progress.service.js";

export const getProgress: RequestHandler = async (_req, res) => {
  const progress = await progressService.get();
  res.json(progress);
};
