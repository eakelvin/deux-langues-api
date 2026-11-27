import { z } from "zod";
import { requestJson } from "./request.js";

const passageSchema = z.object({
  passage: z.string().min(1),
});

const passageJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    passage: { type: "string" },
  },
  required: ["passage"],
};

const instructions = `Tu écris un texte français à lire à voix haute, d'environ 150 mots.
Deux paragraphes. Phrases claires, niveau courant.
Aucun mot anglais. Pas de titre, pas de liste.`;

export function requestPassage() {
  return requestJson({
    schemaName: "mimic_passage",
    jsonSchema: passageJsonSchema,
    schema: passageSchema,
    instructions,
    input: "Donne le texte du jour.",
  });
}
