import { z } from "zod";
import { requestJson } from "./request.js";

export const errorTypes = [
  "accord",
  "conjugaison",
  "orthographe",
  "vocabulaire",
  "syntaxe",
  "ponctuation",
  "aucun",
] as const;

const correctionSchema = z.object({
  original: z.string(),
  corrected: z.string(),
  explanation: z.string(),
  errorType: z.enum(errorTypes),
});

export const correctionReplySchema = z.object({
  corrections: z.array(correctionSchema).min(1),
  correctedText: z.string(),
});

export type CorrectionReply = z.infer<typeof correctionReplySchema>;

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

const correctionJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    corrections: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          original: { type: "string" },
          corrected: { type: "string" },
          explanation: { type: "string" },
          errorType: { type: "string", enum: [...errorTypes] },
        },
        required: ["original", "corrected", "explanation", "errorType"],
      },
    },
    correctedText: { type: "string" },
  },
  required: ["corrections", "correctedText"],
};

const topicInstructions = `Tu proposes un seul sujet d'écriture en français pour un apprenant.
Le sujet est une question d'opinion ou un thème concret, en une ou deux phrases.
N'ajoute pas de consigne en anglais.`;

const correctionInstructions = `Tu corriges un court texte français écrit par un apprenant.
Découpe le texte en phrases.
Pour chaque phrase, donne la phrase d'origine, la phrase corrigée, une explication courte en français, et un type d'erreur.
Types permis : accord, conjugaison, orthographe, vocabulaire, syntaxe, ponctuation, aucun.
Utilise "aucun" quand la phrase est déjà juste, et reprends-la telle quelle.
correctedText est le texte entier corrigé.`;

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
  return requestJson({
    schemaName: "writing_correction",
    jsonSchema: correctionJsonSchema,
    schema: correctionReplySchema,
    instructions: correctionInstructions,
    input: `Sujet : ${prompt}\n\nTexte :\n${text}`,
  });
}
