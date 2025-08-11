import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// For potential future use - download history or analytics
export const downloads = pgTable("downloads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  videoId: text("video_id").notNull(),
  title: text("title").notNull(),
  format: text("format").notNull(),
  quality: text("quality").notNull(),
  downloadedAt: timestamp("downloaded_at").defaultNow(),
  userIp: text("user_ip"),
});

export const insertDownloadSchema = createInsertSchema(downloads).pick({
  videoId: true,
  title: true,
  format: true,
  quality: true,
  userIp: true,
});

export type InsertDownload = z.infer<typeof insertDownloadSchema>;
export type Download = typeof downloads.$inferSelect;

// YouTube video info schema for validation
export const youtubeUrlSchema = z.object({
  url: z.string().url().refine(
    (url) => {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/;
      return youtubeRegex.test(url);
    },
    { message: "Please provide a valid YouTube URL" }
  ),
});

export const downloadRequestSchema = z.object({
  url: z.string().url(),
  format: z.enum(['mp4', 'webm', 'avi', 'mp3', 'wav', 'm4a']),
  quality: z.string(),
  startTime: z.number().min(0).optional(),
  endTime: z.number().min(0).optional(),
});

export type YoutubeUrl = z.infer<typeof youtubeUrlSchema>;
export type DownloadRequest = z.infer<typeof downloadRequestSchema>;
