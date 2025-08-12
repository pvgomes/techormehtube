import { Router } from "express";
import { DownloadController } from "../controllers/downloadController.js";

const router = Router();

// Video info endpoint
router.post("/video-info", DownloadController.getVideoInfo);

// Download endpoint
router.post("/download", DownloadController.downloadVideo);

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Stats endpoint (for monitoring)
router.get("/stats", (req, res) => {
  const stats = {
    status: "running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
  };
  res.json(stats);
});

export default router;