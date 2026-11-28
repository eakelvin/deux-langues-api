import type { RequestHandler } from "express";
import { z } from "zod";
import { reviewService } from "../services/review.service.js";
import { reviewResults } from "../types/review.js";
import { HttpError } from "../utils/http-error.js";

const answerSchema = z.object({
  result: z.enum(reviewResults),
  answer: z.string().trim().min(1).max(2000),
});

function mistakeId(value: string | string[] | undefined): string {
  const id = Array.isArray(value) ? value[0] : value;
  const parsed = z.uuid().safeParse(id);
  if (!parsed.success) throw new HttpError(400, "Invalid mistake id");
  return parsed.data;
}

export const dueReviews: RequestHandler = async (_req, res) => {
  const due = await reviewService.due();
  res.json(due);
};

export const answerReview: RequestHandler = async (req, res) => {
  const parsed = answerSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, 'Send JSON like { "result": "correct", "answer": "..." }.');
  }
  const review = await reviewService.answer(
    mistakeId(req.params.id),
    parsed.data.result,
    parsed.data.answer,
  );
  res.status(201).json(review);
};
