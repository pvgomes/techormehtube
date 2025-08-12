import { type Express } from "express";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function setupStaticFiles(app: Express) {
  const distPath = path.resolve(__dirname, "../../dist");
  const staticHandler = express.static(distPath);

  app.use(staticHandler);
  app.use("*", (req, res, next) => {
    // don't handle requests for routes
    if (req.originalUrl.startsWith("/api")) {
      return next();
    }

    // handle client-side routes by serving index.html
    const indexPath = path.join(distPath, "index.html");
    res.sendFile(indexPath);
  });
}