import express from "express";
import { registerRoutes } from "./routes/index.js";
import { setupVite } from "./config/vite.js";
import { requestLoggingMiddleware, errorHandlingMiddleware } from "./middleware/logging.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use(requestLoggingMiddleware);

(async () => {
  const server = await registerRoutes(app);

  // Error handling middleware
  app.use(errorHandlingMiddleware);

  await setupVite(app, server);

  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    console.log(`${new Date().toLocaleTimeString()} [express] serving on port ${port}`);
  });
})();
