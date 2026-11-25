import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { verifyDatabaseConnection } from "./db/index.js";

const app = createApp();

verifyDatabaseConnection()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Listening on http://localhost:${env.port}`);
    });
  })
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown database error";
    console.error(`Database connection failed: ${message}`);
    process.exit(1);
  });
