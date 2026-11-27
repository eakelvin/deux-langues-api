import OpenAI from "openai";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";

export const conversationModel = "gpt-realtime-2.1";

const instructions = `Tu parles français avec un apprenant.
Réponds à voix haute, brièvement.
Laisse-le finir. Ne l'interromps pas.
Quand il a fini, corrige doucement ce qui ne va pas, puis donne une courte version corrigée.
Ne pose pas une question à chaque tour.`;

export async function createConversationSecret() {
  if (!env.openAiKey) {
    throw new HttpError(500, "OPENAI_API_KEY is missing");
  }

  const client = new OpenAI({ apiKey: env.openAiKey });
  const secret = await client.realtime.clientSecrets.create({
    session: {
      type: "realtime",
      model: conversationModel,
      output_modalities: ["audio"],
      instructions,
      audio: {
        input: {
          transcription: { model: "gpt-transcribe", language: "fr" },
          turn_detection: {
            type: "semantic_vad",
            eagerness: "low",
            create_response: true,
            interrupt_response: false,
          },
        },
        output: { voice: "marin" },
      },
    },
  });

  if (secret.session.type !== "realtime") {
    throw new HttpError(502, "The conversation session could not be created.");
  }

  return {
    value: secret.value,
    expiresAt: secret.expires_at,
    session: secret.session,
  };
}
