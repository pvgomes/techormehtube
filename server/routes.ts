import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { youtubeUrlSchema, downloadRequestSchema } from "@shared/schema";
import ytdl from '@distube/ytdl-core';
import { PassThrough } from 'stream';

export async function registerRoutes(app: Express): Promise<Server> {
  // Get video information from YouTube URL
  app.post("/api/video-info", async (req, res) => {
    try {
      const { url } = youtubeUrlSchema.parse(req.body);
      
      if (!ytdl.validateURL(url)) {
        return res.status(400).json({ message: "Invalid YouTube URL" });
      }

      const info = await ytdl.getInfo(url);
      const videoDetails = info.videoDetails;
      
      // Check video duration (10 minute limit)
      const durationSeconds = parseInt(videoDetails.lengthSeconds);
      if (durationSeconds > 600) { // 10 minutes
        return res.status(400).json({ 
          message: "Video is too long. Maximum duration allowed is 10 minutes." 
        });
      }

      // Get available formats
      const formats = info.formats;
      const videoFormats = formats
        .filter(format => format.hasVideo && format.hasAudio)
        .map(format => ({
          itag: format.itag,
          container: format.container,
          quality: format.quality,
          qualityLabel: format.qualityLabel,
          hasAudio: format.hasAudio,
          hasVideo: format.hasVideo,
          contentLength: format.contentLength
        }));

      const audioFormats = formats
        .filter(format => format.hasAudio && !format.hasVideo)
        .map(format => ({
          itag: format.itag,
          container: format.container,
          quality: format.quality,
          audioBitrate: format.audioBitrate,
          audioQuality: format.audioQuality,
          contentLength: format.contentLength
        }));

      res.json({
        videoId: videoDetails.videoId,
        title: videoDetails.title,
        description: videoDetails.description,
        duration: videoDetails.lengthSeconds,
        views: videoDetails.viewCount,
        channel: videoDetails.author.name,
        thumbnail: videoDetails.thumbnails[videoDetails.thumbnails.length - 1]?.url,
        videoFormats,
        audioFormats
      });

    } catch (error: any) {
      console.error('Error fetching video info:', error);
      res.status(500).json({ 
        message: error.message || "Failed to fetch video information" 
      });
    }
  });

  // Stream download endpoint
  app.post("/api/download", async (req, res) => {
    try {
      const { url, format, quality } = downloadRequestSchema.parse(req.body);
      
      if (!ytdl.validateURL(url)) {
        return res.status(400).json({ message: "Invalid YouTube URL" });
      }

      const info = await ytdl.getInfo(url);
      const videoDetails = info.videoDetails;
      
      // Check video duration again
      const durationSeconds = parseInt(videoDetails.lengthSeconds);
      if (durationSeconds > 600) {
        return res.status(400).json({ 
          message: "Video is too long. Maximum duration allowed is 10 minutes." 
        });
      }

      // Find the best format based on request
      let selectedFormat;
      const formats = info.formats;

      if (['mp4', 'webm', 'avi'].includes(format)) {
        // Video download
        selectedFormat = ytdl.chooseFormat(formats, { 
          quality: quality || 'highest',
          filter: f => f.hasVideo && f.hasAudio && f.container === format
        });
      } else {
        // Audio download
        selectedFormat = ytdl.chooseFormat(formats, { 
          quality: 'highestaudio',
          filter: 'audioonly'
        });
      }

      if (!selectedFormat) {
        return res.status(400).json({ 
          message: `No suitable format found for ${format} ${quality}` 
        });
      }

      // Set appropriate headers for download
      const filename = `${videoDetails.title.replace(/[^a-z0-9]/gi, '_')}.${selectedFormat.container}`;
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', selectedFormat.mimeType || 'application/octet-stream');
      
      if (selectedFormat.contentLength) {
        res.setHeader('Content-Length', selectedFormat.contentLength);
      }

      // Log download (optional)
      try {
        await storage.logDownload({
          videoId: videoDetails.videoId,
          title: videoDetails.title,
          format,
          quality: quality || 'default',
          userIp: req.ip || 'unknown'
        });
      } catch (logError) {
        console.warn('Failed to log download:', logError);
      }

      // Stream the video directly to the response
      const stream = ytdl(url, { format: selectedFormat });
      
      stream.on('error', (error) => {
        console.error('Stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Download failed' });
        }
      });

      stream.pipe(res);

    } catch (error: any) {
      console.error('Download error:', error);
      if (!res.headersSent) {
        res.status(500).json({ 
          message: error.message || "Download failed" 
        });
      }
    }
  });

  // Get download stats (optional endpoint)
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getDownloadStats();
      res.json(stats);
    } catch (error: any) {
      console.error('Stats error:', error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
