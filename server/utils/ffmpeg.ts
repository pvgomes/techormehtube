import { Readable } from "stream";
import ffmpeg from "fluent-ffmpeg";

export interface ConversionOptions {
  format: string;
  startTime?: number;
  endTime?: number;
  audioBitrate?: string;
  videoQuality?: string;
}

export class FFmpegService {
  static convertStream(inputStream: Readable, options: ConversionOptions): NodeJS.ReadableStream {
    const { format, startTime, endTime, audioBitrate } = options;
    
    const command = ffmpeg(inputStream)
      .format(format)
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        throw new Error(`Conversion failed: ${err.message}`);
      });

    // Add time range if specified
    if (typeof startTime === 'number') {
      command.seekInput(startTime);
    }
    
    if (typeof endTime === 'number' && typeof startTime === 'number') {
      const duration = endTime - startTime;
      command.duration(duration);
    }

    // Set audio bitrate for audio formats
    if (audioBitrate && (format === 'mp3' || format === 'wav')) {
      command.audioBitrate(audioBitrate);
    }

    // Remove video for audio-only formats
    if (format === 'mp3' || format === 'wav') {
      command.noVideo();
    }

    return command.pipe();
  }

  static getFileExtension(format: string): string {
    const extensions: Record<string, string> = {
      'mp4': 'mp4',
      'webm': 'webm', 
      'avi': 'avi',
      'mp3': 'mp3',
      'wav': 'wav',
    };
    
    return extensions[format] || format;
  }

  static getMimeType(format: string): string {
    const mimeTypes: Record<string, string> = {
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'avi': 'video/x-msvideo',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
    };
    
    return mimeTypes[format] || 'application/octet-stream';
  }
}