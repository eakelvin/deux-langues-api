import { z } from "zod";
import { requestJson } from "./request.js";
import { requestWritingMistakes } from "./mistakes.js";

const topicSchema = z.object({
  topic: z.string().min(1),
});

const topicJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    topic: { type: "string" },
  },
  required: ["topic"],
};

const topicInstructions = `Tu proposes un seul sujet d'écriture en français pour un apprenant.
Le sujet est une question d'opinion ou un thème concret, en une ou deux phrases.
N'ajoute pas de consigne en anglais.`;

export function requestTopic() {
  return requestJson({
    schemaName: "writing_topic",
    jsonSchema: topicJsonSchema,
    schema: topicSchema,
    instructions: topicInstructions,
    input: "Donne le sujet du jour.",
  });
}

export function requestCorrection(prompt: string, text: string) {
  return requestWritingMistakes(prompt, text);
}
