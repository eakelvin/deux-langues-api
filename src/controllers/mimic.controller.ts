import type { RequestHandler } from "express";
import { z } from "zod";
import { mimicService } from "../services/mimic.service.js";
import { HttpError } from "../utils/http-error.js";

function exerciseId(value: string | string[] | undefined): string {
  const id = Array.isArray(value) ? value[0] : value;
  const parsed = z.uuid().safeParse(id);
  if (!parsed.success) throw new HttpError(400, "Invalid exercise id");
  return parsed.data;
}

export const createMimic: RequestHandler = async (_req, res) => {
  const exercise = await mimicService.create();
  res.status(201).json(exercise);
};

export const getMimic: RequestHandler = async (req, res) => {
  const exercise = await mimicService.get(exerciseId(req.params.id));
  res.json(exercise);
};

export const recordMimic: RequestHandler = async (req, res) => {
  const parsed = z.object({ transcript: z.string() }).safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, 'Send JSON like { "transcript": "what you read" }.');
  }
  const exercise = await mimicService.record(exerciseId(req.params.id), parsed.data.transcript);
  res.json(exercise);
};
