import { asc, eq } from "drizzle-orm";
import { createConversationSecret } from "../ai/conversation.js";
import { requestConversationMistakes } from "../ai/mistakes.js";
import { AiParseError } from "../ai/request.js";
import { db } from "../db/index.js";
import { conversationSessions, conversationTurns } from "../db/schema.js";
import type { TurnRole } from "../types/conversation.js";
import { notesService } from "./notes.service.js";
import { streakService } from "./streak.service.js";
import { HttpError } from "../utils/http-error.js";

async function findSession(id: string) {
  const [session] = await db
    .select()
    .from(conversationSessions)
    .where(eq(conversationSessions.id, id));
  if (!session) throw new HttpError(404, "Conversation not found");
  return session;
}

export const conversationService = {
  async create() {
    const secret = await createConversationSecret();
    const [session] = await db.insert(conversationSessions).values({}).returning();
    const turnDetection = secret.session.audio?.input?.turn_detection;

    return {
      id: session.id,
      createdAt: session.createdAt,
      clientSecret: secret.value,
      expiresAt: secret.expiresAt,
      model: secret.session.model,
      voice: secret.session.audio?.output?.voice ?? null,
      turnDetection: turnDetection?.type ?? null,
    };
  },

  async get(id: string) {
    const session = await findSession(id);
    const turns = await db
      .select()
      .from(conversationTurns)
      .where(eq(conversationTurns.sessionId, id))
      .orderBy(asc(conversationTurns.createdAt));
    return { ...session, turns };
  },

  async addTurn(id: string, role: TurnRole, content: string) {
    await findSession(id);
    const [turn] = await db
      .insert(conversationTurns)
      .values({ sessionId: id, role, content })
      .returning();
    await db
      .update(conversationSessions)
      .set({ updatedAt: new Date() })
      .where(eq(conversationSessions.id, id));
    if (role === "user") {
      await streakService.mark("conversation");
      try {
        const checked = await requestConversationMistakes(content);
        await notesService.record({
          flow: "conversation",
          sourceId: turn.id,
          responseText: content,
          mistakes: checked.mistakes,
        });
      } catch (error) {
        if (!(error instanceof AiParseError)) throw error;
      }
    }
    return turn;
  },
};
