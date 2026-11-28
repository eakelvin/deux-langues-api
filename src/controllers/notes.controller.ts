import type { RequestHandler } from "express";
import { z } from "zod";
import { errorCategories } from "../constants/categories.js";
import { notesService } from "../services/notes.service.js";
import { flows } from "../types/flow.js";
import { HttpError } from "../utils/http-error.js";

const querySchema = z.object({
  flow: z.enum(flows).optional(),
  category: z.enum(errorCategories).optional(),
});

export const listNotes: RequestHandler = async (req, res) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) throw new HttpError(400, "Unknown flow or category.");
  const notes = await notesService.list(parsed.data);
  res.json({ notes });
};
