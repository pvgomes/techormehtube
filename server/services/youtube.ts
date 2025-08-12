import ytdl from "@distube/ytdl-core";
import { type VideoInfo, type VideoFormat, type AudioFormat } from "../../shared/schema";

export class YouTubeService {
  static validateUrl(url: string): boolean {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/;
    return youtubeRegex.test(url) && ytdl.validateURL(url);
  }

  static async getVideoInfo(url: string): Promise<VideoInfo> {
    if (!this.validateUrl(url)) {
      throw new Error("Invalid YouTube URL");
    }

    const info = await ytdl.getInfo(url);
    
    // Check duration limit (10 minutes = 600 seconds)
    const duration = parseInt(info.videoDetails.lengthSeconds);
    if (duration > 600) {
      throw new Error("Video duration exceeds 10 minutes limit");
    }

    const videoFormats: VideoFormat[] = info.formats
      .filter((format) => format.hasVideo && format.hasAudio)
      .map((format) => ({
        itag: format.itag,
        container: format.container as string,
        quality: format.quality as string,
        qualityLabel: format.qualityLabel,
        hasAudio: format.hasAudio,
        hasVideo: format.hasVideo,
      }));

    const audioFormats: AudioFormat[] = info.formats
      .filter((format) => format.hasAudio && !format.hasVideo)
      .map((format) => ({
        itag: format.itag,
        container: format.container as string,
        quality: format.quality as string,
        audioBitrate: format.audioBitrate,
        audioQuality: format.audioQuality,
        contentLength: format.contentLength,
      }));

    return {
      videoId: info.videoDetails.videoId,
      title: info.videoDetails.title,
      description: info.videoDetails.description,
      duration: info.videoDetails.lengthSeconds,
      views: info.videoDetails.viewCount,
      channel: info.videoDetails.author.name,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]?.url,
      videoFormats,
      audioFormats,
    };
  }

  static getDownloadStream(url: string, options: ytdl.downloadOptions) {
    if (!this.validateUrl(url)) {
      throw new Error("Invalid YouTube URL");
    }
    
    return ytdl(url, options);
  }
}