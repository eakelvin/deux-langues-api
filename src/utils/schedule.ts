import type { ReviewResult } from "../types/review.js";
import { addDays } from "./streak.js";

const correctIntervals = [1, 3, 7];

export function nextDueDate(
  today: string,
  result: ReviewResult,
  correctInARow: number,
): string {
  if (result === "incorrect") return addDays(today, 1);
  const index = Math.min(correctInARow, correctIntervals.length) - 1;
  return addDays(today, correctIntervals[index] ?? 7);
}
