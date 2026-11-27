import { z } from "zod";
import { HttpError } from "../utils/http-error.js";
import type { Transcriber } from "./types.js";

const transcriptSchema = z.string().trim().min(1).max(8000);

export const browserTranscriber: Transcriber = {
  async transcribe(input) {
    const parsed = transcriptSchema.safeParse(input.transcript);
    if (!parsed.success) throw new HttpError(400, "A transcript is required");
    return { provider: "browser", text: parsed.data };
  },
};
