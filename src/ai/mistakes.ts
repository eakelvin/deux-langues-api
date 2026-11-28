import { z } from "zod";
import { categoryList, errorCategories } from "../constants/categories.js";
import type { MistakeItem } from "../types/mistake.js";
import { requestJson } from "./request.js";

export const mistakeSchema = z.object({
  phrase: z.string().trim().min(1),
  original: z.string().trim().min(1),
  corrected: z.string().trim().min(1),
  explanation: z.string().trim().min(1),
  category: z.enum(errorCategories),
}) satisfies z.ZodType<MistakeItem>;

export const mistakeListSchema = z.object({
  mistakes: z.array(mistakeSchema),
});

const mistakeJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mistakes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          phrase: { type: "string" },
          original: { type: "string" },
          corrected: { type: "string" },
          explanation: { type: "string" },
          category: { type: "string", enum: [...errorCategories] },
        },
        required: ["phrase", "original", "corrected", "explanation", "category"],
      },
    },
  },
  required: ["mistakes"],
};

const sharedRules = `Chaque erreur a :
- phrase : le mot ou le court groupe fautif, pas la phrase entière
- original : la phrase d'origine
- corrected : cette phrase corrigée
- explanation : une explication courte en français
- category : une seule valeur parmi ${categoryList}
S'il n'y a aucune erreur, renvoie une liste vide.
Ne regroupe pas deux erreurs différentes dans la même phrase.`;

export function requestWritingMistakes(prompt: string, text: string) {
  return requestJson({
    schemaName: "writing_mistakes",
    jsonSchema: {
      ...mistakeJsonSchema,
      properties: {
        ...mistakeJsonSchema.properties,
        correctedText: { type: "string" },
      },
      required: ["mistakes", "correctedText"],
    },
    schema: mistakeListSchema.extend({ correctedText: z.string() }),
    instructions: `Tu corriges un court texte français.
${sharedRules}
correctedText est le texte entier corrigé.`,
    input: `Sujet : ${prompt}\n\nTexte :\n${text}`,
  });
}

export function requestMimicMistakes(passage: string, transcript: string) {
  return requestJson({
    schemaName: "mimic_mistakes",
    jsonSchema: mistakeJsonSchema,
    schema: mistakeListSchema,
    instructions: `Tu compares une lecture à voix haute avec le texte d'origine.
Signale seulement les mots manqués ou faux.
phrase est un mot, ou deux, jamais une phrase entière.
${sharedRules}`,
    input: `Texte d'origine :\n${passage}\n\nLecture :\n${transcript}`,
  });
}

export function requestConversationMistakes(text: string) {
  return requestJson({
    schemaName: "conversation_mistakes",
    jsonSchema: mistakeJsonSchema,
    schema: mistakeListSchema,
    instructions: `Tu relèves les erreurs d'une phrase dite par un apprenant.
Ne rédige pas de réponse de conversation.
${sharedRules}`,
    input: text,
  });
}
