import { type Express } from "express";
import { createServer } from "http";
import apiRoutes from "./api.js";
import { storage } from "../storage.js";

export async function registerRoutes(app: Express) {
  // Register API routes
  app.use("/api", apiRoutes);
  
  // Create HTTP server
  const server = createServer(app);
  
  return server;
}