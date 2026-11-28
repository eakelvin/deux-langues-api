import { eq } from "drizzle-orm";
import { requestMimicMistakes } from "../ai/mistakes.js";
import { AiParseError } from "../ai/request.js";
import { requestPassage } from "../ai/mimic.js";
import { db } from "../db/index.js";
import { exercises } from "../db/schema.js";
import { notesService } from "./notes.service.js";
import { streakService } from "./streak.service.js";
import { transcriber } from "./transcription/index.js";
import { HttpError } from "../utils/http-error.js";

export const mimicService = {
  async create() {
    let passage: string;
    try {
      const result = await requestPassage();
      passage = result.passage;
    } catch (error) {
      if (error instanceof AiParseError) {
        throw new HttpError(502, "The passage could not be read.");
      }
      throw error;
    }

    const [exercise] = await db
      .insert(exercises)
      .values({ flow: "mimic", prompt: passage })
      .returning();
    return exercise;
  },

  async get(id: string) {
    const [exercise] = await db.select().from(exercises).where(eq(exercises.id, id));
    if (!exercise || exercise.flow !== "mimic") {
      throw new HttpError(404, "Exercise not found");
    }
    return exercise;
  },

  async record(id: string, transcript: string) {
    await this.get(id);
    const transcription = await transcriber.transcribe({
      provider: "browser",
      transcript,
    });
    const [updated] = await db
      .update(exercises)
      .set({ response: transcription.text, updatedAt: new Date() })
      .where(eq(exercises.id, id))
      .returning();
    await streakService.mark("mimic");
    try {
      const compared = await requestMimicMistakes(updated.prompt, transcription.text);
      await notesService.record({
        flow: "mimic",
        sourceId: id,
        responseText: transcription.text,
        mistakes: compared.mistakes,
      });
    } catch (error) {
      if (!(error instanceof AiParseError)) throw error;
    }
    return updated;
  },
};
