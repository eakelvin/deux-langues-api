import type { ErrorRequestHandler } from "express";
import { HttpError } from "../utils/http-error.js";

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ message: 'Invalid JSON format in request body' });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};
