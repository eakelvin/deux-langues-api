import { Router } from "express";
import { listNotes } from "../controllers/notes.controller.js";

export const notesRouter = Router();

notesRouter.get("/", listNotes);
