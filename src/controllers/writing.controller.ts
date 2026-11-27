import type { RequestHandler } from "express";
import { z } from "zod";
import { writingService } from "../services/writing.service.js";
import { HttpError } from "../utils/http-error.js";

const textSchema = z.object({
  text: z.string().trim().min(1).max(4000),
});

function exerciseId(value: string | string[] | undefined): string {
  const id = Array.isArray(value) ? value[0] : value;
  const parsed = z.uuid().safeParse(id);
  if (!parsed.success) throw new HttpError(400, "Invalid exercise id");
  return parsed.data;
}

export const createWriting: RequestHandler = async (_req, res) => {
  const exercise = await writingService.create();
  res.status(201).json(exercise);
};

export const getWriting: RequestHandler = async (req, res) => {
  const exercise = await writingService.get(exerciseId(req.params.id));
  res.json(exercise);
};

export const submitWriting: RequestHandler = async (req, res) => {
  const parsed = textSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Text is required");
  const exercise = await writingService.submit(exerciseId(req.params.id), parsed.data.text);
  res.json(exercise);
};
