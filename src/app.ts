import cors from "cors";
import express from "express";
import helmet from "helmet";

import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/not-found.middleware.js";
import { router } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  
  app.use(router);
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
