import { Router } from "express";
import {
  addTurn,
  createConversation,
  getConversation,
} from "../controllers/conversation.controller.js";

export const conversationRouter = Router();

conversationRouter.post("/", createConversation);
conversationRouter.get("/:id", getConversation);
conversationRouter.post("/:id/turns", addTurn);
