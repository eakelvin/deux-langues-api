import { boolean, date, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { CorrectionReply } from "../ai/writing.js";

export const exerciseFlow = pgEnum("exercise_flow", ["written", "mimic", "conversation"]);
export const turnRole = pgEnum("turn_role", ["user", "assistant"]);

export const exercises = pgTable("exercises", {
  id: uuid("id").primaryKey().defaultRandom(),
  flow: exerciseFlow("flow").notNull(),
  prompt: text("prompt").notNull(),
  response: text("response"),
  reply: jsonb("reply").$type<CorrectionReply | null>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const dailyProgress = pgTable("daily_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: date("date").notNull().unique(),
  written: boolean("written").notNull().default(false),
  mimic: boolean("mimic").notNull().default(false),
  conversation: boolean("conversation").notNull().default(false),
});

export const conversationSessions = pgTable("conversation_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const conversationTurns = pgTable("conversation_turns", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => conversationSessions.id),
  role: turnRole("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
