import { type VideoInfo, type DownloadRequest } from "@shared/schema";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export class ApiService {
  static async getVideoInfo(url: string): Promise<VideoInfo> {
    const response = await fetch(`${API_BASE_URL}/api/video-info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Failed to get video info" }));
      throw new Error(error.message || "Failed to get video info");
    }

    return response.json();
  }

  static async downloadFile(request: DownloadRequest): Promise<Response> {
    const response = await fetch(`${API_BASE_URL}/api/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Download failed" }));
      throw new Error(error.message || "Download failed");
    }

    return response;
  }

  static async getHealthStatus(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    
    if (!response.ok) {
      throw new Error("Health check failed");
    }

    return response.json();
  }

  static async getStats(): Promise<{
    status: string;
    timestamp: string;
    uptime: number;
    memory: NodeJS.MemoryUsage;
    version: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/api/stats`);
    
    if (!response.ok) {
      throw new Error("Failed to get stats");
    }

    return response.json();
  }
}