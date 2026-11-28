import { env } from "../config/env.js";
import { db } from "../db/index.js";
import { dailyProgress } from "../db/schema.js";
import { currentStreak, localDate } from "../utils/streak.js";

export type Flow = "written" | "mimic" | "conversation";

function flagUpdate(flow: Flow) {
  if (flow === "written") return { written: true };
  if (flow === "mimic") return { mimic: true };
  return { conversation: true };
}

export const streakService = {
  async mark(flow: Flow) {
    const date = localDate(env.timeZone);
    await db
      .insert(dailyProgress)
      .values({
        date,
        written: flow === "written",
        mimic: flow === "mimic",
        conversation: flow === "conversation",
      })
      .onConflictDoUpdate({
        target: dailyProgress.date,
        set: flagUpdate(flow),
      });
  },

  async get() {
    const date = localDate(env.timeZone);
    const rows = await db.select().from(dailyProgress);
    const today = rows.find((row) => row.date === date);
    const flows = {
      written: today?.written ?? false,
      mimic: today?.mimic ?? false,
      conversation: today?.conversation ?? false,
    };
    const completeDates = rows
      .filter((row) => row.written && row.mimic && row.conversation)
      .map((row) => row.date);

    return {
      date,
      streak: currentStreak(completeDates, date),
      todayComplete: flows.written && flows.mimic && flows.conversation,
      flows,
    };
  },
};
