import { desc } from "drizzle-orm";
import { env } from "../config/env.js";
import { db } from "../db/index.js";
import { mistakes } from "../db/schema.js";
import type { ErrorCategory } from "../types/category.js";
import type { Flow } from "../types/flow.js";
import type { MistakeItem } from "../types/mistake.js";
import { localDate } from "../utils/streak.js";

export function wordCount(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

function phraseKey(phrase: string): string {
  return phrase.trim().toLocaleLowerCase("fr-FR");
}

function repeatKey(category: string, phrase: string): string {
  return `${category}\0${phraseKey(phrase)}`;
}

export const notesService = {
  async record(input: {
    flow: Flow;
    sourceId: string;
    responseText: string;
    mistakes: MistakeItem[];
  }) {
    if (input.mistakes.length === 0) return;
    const count = wordCount(input.responseText);
    const dueOn = localDate(env.timeZone);
    await db.insert(mistakes).values(
      input.mistakes.map((mistake) => ({
        flow: input.flow,
        category: mistake.category,
        phrase: mistake.phrase,
        original: mistake.original,
        corrected: mistake.corrected,
        explanation: mistake.explanation,
        sourceId: input.sourceId,
        wordCount: count,
        dueOn,
      })),
    );
  },

  async list(filter: { flow?: Flow; category?: ErrorCategory }) {
    const rows = await db.select().from(mistakes).orderBy(desc(mistakes.createdAt));
    const counts = new Map<string, number>();
    for (const row of rows) {
      const key = repeatKey(row.category, row.phrase);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return rows
      .filter((row) => filter.flow === undefined || row.flow === filter.flow)
      .filter((row) => filter.category === undefined || row.category === filter.category)
      .map((row) => ({
        ...row,
        repeats: counts.get(repeatKey(row.category, row.phrase)) ?? 1,
      }));
  },
};
