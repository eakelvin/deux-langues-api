import { Router } from "express";
import { answerReview, dueReviews } from "../controllers/review.controller.js";

export const reviewRouter = Router();

reviewRouter.get("/", dueReviews);
reviewRouter.post("/:id", answerReview);
