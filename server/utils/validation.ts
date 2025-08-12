import { z } from "zod";

export const videoInfoSchema = z.object({
  url: z.string().url("Invalid URL format"),
});

export const downloadSchema = z.object({
  url: z.string().url("Invalid URL format"),
  format: z.enum(['mp4', 'webm', 'avi', 'mp3', 'wav'], {
    errorMap: () => ({ message: "Invalid format. Supported formats: mp4, webm, avi, mp3, wav" })
  }),
  quality: z.string().optional(),
  startTime: z.number().min(0, "Start time must be positive").optional(),
  endTime: z.number().min(0, "End time must be positive").optional(),
}).refine((data) => {
  if (data.startTime !== undefined && data.endTime !== undefined) {
    return data.endTime > data.startTime;
  }
  return true;
}, {
  message: "End time must be greater than start time",
  path: ["endTime"],
});

export type VideoInfoRequest = z.infer<typeof videoInfoSchema>;
export type DownloadRequest = z.infer<typeof downloadSchema>;

export function validateTimeRange(startTime?: number, endTime?: number, videoDuration?: number): void {
  if (startTime !== undefined && startTime < 0) {
    throw new Error("Start time cannot be negative");
  }
  
  if (endTime !== undefined && endTime < 0) {
    throw new Error("End time cannot be negative");
  }
  
  if (startTime !== undefined && endTime !== undefined && endTime <= startTime) {
    throw new Error("End time must be greater than start time");
  }
  
  if (videoDuration && endTime && endTime > videoDuration) {
    throw new Error("End time cannot exceed video duration");
  }
}