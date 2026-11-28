import type { RequestHandler } from "express";
import { z } from "zod";
import { conversationService } from "../services/conversation.service.js";
import { turnRoles } from "../types/conversation.js";
import { HttpError } from "../utils/http-error.js";

const turnSchema = z.object({
  role: z.enum(turnRoles),
  content: z.string().trim().min(1).max(8000),
});

function sessionId(value: string | string[] | undefined): string {
  const id = Array.isArray(value) ? value[0] : value;
  const parsed = z.uuid().safeParse(id);
  if (!parsed.success) throw new HttpError(400, "Invalid conversation id");
  return parsed.data;
}

export const createConversation: RequestHandler = async (_req, res) => {
  const session = await conversationService.create();
  res.status(201).json(session);
};

export const getConversation: RequestHandler = async (req, res) => {
  const session = await conversationService.get(sessionId(req.params.id));
  res.json(session);
};

export const addTurn: RequestHandler = async (req, res) => {
  const parsed = turnSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, 'Send JSON like { "role": "user", "content": "..." }.');
  }
  const turn = await conversationService.addTurn(
    sessionId(req.params.id),
    parsed.data.role,
    parsed.data.content,
  );
  res.status(201).json(turn);
};
