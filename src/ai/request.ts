import OpenAI from "openai";
import type { ZodType } from "zod";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";

export const learningModel = "gpt-6.2-sol";

export class AiParseError extends Error {
  constructor() {
    super("The model reply could not be read");
  }
}

type JsonSchema = Record<string, unknown>;

export async function requestJson<T>(options: {
  schemaName: string;
  jsonSchema: JsonSchema;
  schema: ZodType<T>;
  instructions: string;
  input: string;
}): Promise<T> {
  if (!env.openAiKey) {
    throw new HttpError(500, "OPENAI_API_KEY is missing");
  }

  const client = new OpenAI({ apiKey: env.openAiKey });
  const response = await client.responses.create({
    model: learningModel,
    instructions: options.instructions,
    input: options.input,
    text: {
      format: {
        type: "json_schema",
        name: options.schemaName,
        strict: true,
        schema: options.jsonSchema,
      },
    },
  });

  let body: unknown;
  try {
    body = JSON.parse(response.output_text);
  } catch {
    throw new AiParseError();
  }

  const parsed = options.schema.safeParse(body);
  if (!parsed.success) throw new AiParseError();
  return parsed.data;
}
