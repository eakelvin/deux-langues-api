import { desc, eq, lte } from "drizzle-orm";
import { env } from "../config/env.js";
import { db } from "../db/index.js";
import { mistakes, reviewAttempts } from "../db/schema.js";
import type { ReviewResult } from "../types/review.js";
import { nextDueDate } from "../utils/schedule.js";
import { localDate } from "../utils/streak.js";
import { HttpError } from "../utils/http-error.js";

function correctInARow(results: { result: ReviewResult }[]): number {
  let count = 0;
  for (const attempt of results) {
    if (attempt.result !== "correct") break;
    count += 1;
  }
  return count;
}

export const reviewService = {
  async due() {
    const today = localDate(env.timeZone);
    const rows = await db
      .select({
        id: mistakes.id,
        flow: mistakes.flow,
        category: mistakes.category,
        phrase: mistakes.phrase,
        original: mistakes.original,
        dueOn: mistakes.dueOn,
      })
      .from(mistakes)
      .where(lte(mistakes.dueOn, today))
      .orderBy(mistakes.dueOn);

    return { date: today, items: rows };
  },

  async answer(id: string, result: ReviewResult, answer: string) {
    const [mistake] = await db.select().from(mistakes).where(eq(mistakes.id, id));
    if (!mistake) throw new HttpError(404, "Mistake not found");

    const previous = await db
      .select({ result: reviewAttempts.result })
      .from(reviewAttempts)
      .where(eq(reviewAttempts.mistakeId, id))
      .orderBy(desc(reviewAttempts.createdAt));

    const streak = result === "correct" ? correctInARow(previous) + 1 : 0;
    const dueOn = nextDueDate(localDate(env.timeZone), result, streak);

    const [attempt] = await db
      .insert(reviewAttempts)
      .values({ mistakeId: id, result, answer })
      .returning();
    await db.update(mistakes).set({ dueOn }).where(eq(mistakes.id, id));

    return {
      id: attempt.id,
      result: attempt.result,
      dueOn,
      corrected: mistake.corrected,
      explanation: mistake.explanation,
    };
  },
};
