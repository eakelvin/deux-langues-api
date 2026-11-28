import { eq } from "drizzle-orm";
import { AiParseError } from "../ai/request.js";
import { requestCorrection, requestTopic } from "../ai/writing.js";
import { db } from "../db/index.js";
import { exercises } from "../db/schema.js";
import { notesService } from "./notes.service.js";
import { streakService } from "./streak.service.js";
import { HttpError } from "../utils/http-error.js";

async function findWritten(id: string) {
  const [exercise] = await db.select().from(exercises).where(eq(exercises.id, id));
  if (!exercise || exercise.flow !== "written") {
    throw new HttpError(404, "Exercise not found");
  }
  return exercise;
}

export const writingService = {
  async create() {
    const { topic } = await requestTopic();
    const [exercise] = await db
      .insert(exercises)
      .values({ flow: "written", prompt: topic })
      .returning();
    return exercise;
  },

  get(id: string) {
    return findWritten(id);
  },

  async submit(id: string, text: string) {
    const exercise = await findWritten(id);
    const savedAt = new Date();
    await db
      .update(exercises)
      .set({ response: text, updatedAt: savedAt })
      .where(eq(exercises.id, id));

    try {
      const checked = await requestCorrection(exercise.prompt, text);
      const reply = { corrections: checked.mistakes, correctedText: checked.correctedText };
      const [updated] = await db
        .update(exercises)
        .set({ reply, updatedAt: new Date() })
        .where(eq(exercises.id, id))
        .returning();
      await notesService.record({
        flow: "written",
        sourceId: id,
        responseText: text,
        mistakes: checked.mistakes,
      });
      await streakService.mark("written");
      return updated;
    } catch (error) {
      if (error instanceof AiParseError) {
        throw new HttpError(502, "The correction could not be read. Your text was saved.");
      }
      throw error;
    }
  },
};
