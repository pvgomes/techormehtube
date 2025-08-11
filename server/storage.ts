import { type Download, type InsertDownload } from "@shared/schema";
import { randomUUID } from "crypto";

// Simple interface for download tracking (optional)
export interface IStorage {
  logDownload(download: InsertDownload): Promise<Download>;
  getDownloadStats(): Promise<{ totalDownloads: number; recentDownloads: Download[] }>;
}

export class MemStorage implements IStorage {
  private downloads: Map<string, Download>;

  constructor() {
    this.downloads = new Map();
  }

  async logDownload(insertDownload: InsertDownload): Promise<Download> {
    const id = randomUUID();
    const download: Download = { 
      ...insertDownload, 
      id,
      downloadedAt: new Date()
    };
    this.downloads.set(id, download);
    return download;
  }

  async getDownloadStats(): Promise<{ totalDownloads: number; recentDownloads: Download[] }> {
    const allDownloads = Array.from(this.downloads.values());
    const recentDownloads = allDownloads
      .sort((a, b) => (b.downloadedAt?.getTime() || 0) - (a.downloadedAt?.getTime() || 0))
      .slice(0, 10);
    
    return {
      totalDownloads: allDownloads.length,
      recentDownloads
    };
  }
}

export const storage = new MemStorage();
