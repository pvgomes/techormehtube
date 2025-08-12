import { type Request, Response } from "express";
import { YouTubeService } from "../services/youtube.js";
import { FFmpegService } from "../utils/ffmpeg.js";
import { downloadSchema, type DownloadRequest } from "../utils/validation.js";
import { ZodError } from "zod";

export class DownloadController {
  static async getVideoInfo(req: Request, res: Response) {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }

      const videoInfo = await YouTubeService.getVideoInfo(url);
      res.json(videoInfo);
    } catch (error) {
      console.error("Video info error:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to get video info" 
      });
    }
  }

  static async downloadVideo(req: Request, res: Response) {
    try {
      const validatedData = downloadSchema.parse(req.body);
      const { url, format, quality, startTime, endTime } = validatedData;

      // Validate YouTube URL
      if (!YouTubeService.validateUrl(url)) {
        return res.status(400).json({ message: "Invalid YouTube URL" });
      }

      // Get video info to validate duration and get title
      const videoInfo = await YouTubeService.getVideoInfo(url);
      const videoDuration = parseInt(videoInfo.duration);

      // Validate time range
      if (startTime !== undefined && startTime >= videoDuration) {
        return res.status(400).json({ message: "Start time cannot exceed video duration" });
      }
      
      if (endTime !== undefined && endTime > videoDuration) {
        return res.status(400).json({ message: "End time cannot exceed video duration" });
      }

      // Set download options
      const downloadOptions: any = {
        quality: quality || 'highest',
      };

      // For audio formats, get audio-only stream
      if (['mp3', 'wav'].includes(format)) {
        downloadOptions.filter = 'audioonly';
      } else {
        downloadOptions.filter = 'videoandaudio';
      }

      // Get the download stream
      const videoStream = YouTubeService.getDownloadStream(url, downloadOptions);

      // Set response headers
      const fileExtension = FFmpegService.getFileExtension(format);
      const mimeType = FFmpegService.getMimeType(format);
      const filename = `${videoInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExtension}`;

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      // If time range is specified or format conversion needed, use FFmpeg
      if (startTime !== undefined || endTime !== undefined || ['mp3', 'wav'].includes(format)) {
        const convertedStream = FFmpegService.convertStream(videoStream, {
          format,
          startTime,
          endTime,
          audioBitrate: format === 'mp3' ? '192k' : undefined,
        });

        convertedStream.pipe(res);
      } else {
        // Direct stream for video formats without time range
        videoStream.pipe(res);
      }

    } catch (error) {
      console.error("Download error:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data",
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Download failed" 
      });
    }
  }
}