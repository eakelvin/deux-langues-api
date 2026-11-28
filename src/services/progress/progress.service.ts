import { env } from "../../config/env.js";
import { db } from "../../db/index.js";
import { conversationTurns, dailyProgress, exercises, mistakes, reviewAttempts } from "../../db/schema.js";
import { progressReport } from "./stats.js";
import { wordCount } from "../notes.service.js";
import { localDate } from "../../utils/streak.js";

function phraseKey(category: string, phrase: string): string {
  return `${category}\0${phrase.trim().toLocaleLowerCase("fr-FR")}`;
}

function dated(timeZone: string, value: Date): string {
  return localDate(timeZone, value);
}

export const progressService = {
  async get() {
    const timeZone = env.timeZone;
    const today = localDate(timeZone);
    const [progressRows, mistakeRows, attemptRows, exerciseRows, turnRows] = await Promise.all([
      db.select().from(dailyProgress),
      db.select().from(mistakes),
      db.select().from(reviewAttempts),
      db.select().from(exercises),
      db.select().from(conversationTurns),
    ]);

    return progressReport({
      today,
      practicedDates: progressRows
        .filter((row) => row.written || row.mimic || row.conversation)
        .map((row) => row.date),
      mistakes: mistakeRows.map((row) => ({
        id: row.id,
        key: phraseKey(row.category, row.phrase),
        at: row.createdAt.getTime(),
        date: dated(timeZone, row.createdAt),
      })),
      attempts: attemptRows.map((row) => ({
        mistakeId: row.mistakeId,
        result: row.result,
        at: row.createdAt.getTime(),
        date: dated(timeZone, row.createdAt),
      })),
      responses: [
        ...exerciseRows
          .filter((row) => row.response)
          .map((row) => ({
            date: dated(timeZone, row.updatedAt),
            words: wordCount(row.response ?? ""),
          })),
        ...turnRows
          .filter((row) => row.role === "user")
          .map((row) => ({
            date: dated(timeZone, row.createdAt),
            words: wordCount(row.content),
          })),
      ].filter((row) => row.words > 0),
    });
  },
};
