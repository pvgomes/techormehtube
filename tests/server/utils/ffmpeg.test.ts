import { FFmpegService } from '../../../server/utils/ffmpeg';
import { Readable } from 'stream';

// Mock fluent-ffmpeg
jest.mock('fluent-ffmpeg', () => {
  const mockCommand = {
    format: jest.fn().mockReturnThis(),
    seekInput: jest.fn().mockReturnThis(),
    duration: jest.fn().mockReturnThis(),
    audioBitrate: jest.fn().mockReturnThis(),
    noVideo: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
    pipe: jest.fn().mockReturnValue({ pipe: jest.fn() }),
  };
  
  return jest.fn(() => mockCommand);
});

import ffmpeg from 'fluent-ffmpeg';

const mockFfmpeg = ffmpeg as jest.MockedFunction<typeof ffmpeg>;

describe('FFmpegService', () => {
  let mockCommand: any;
  let mockStream: Readable;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCommand = {
      format: jest.fn().mockReturnThis(),
      seekInput: jest.fn().mockReturnThis(),
      duration: jest.fn().mockReturnThis(),
      audioBitrate: jest.fn().mockReturnThis(),
      noVideo: jest.fn().mockReturnThis(),
      on: jest.fn().mockReturnThis(),
      pipe: jest.fn().mockReturnValue({ pipe: jest.fn() }),
    };
    mockFfmpeg.mockReturnValue(mockCommand);
    mockStream = new Readable();
  });

  describe('convertStream', () => {
    it('should set up basic conversion', () => {
      const options = { format: 'mp4' };
      
      FFmpegService.convertStream(mockStream, options);

      expect(mockFfmpeg).toHaveBeenCalledWith(mockStream);
      expect(mockCommand.format).toHaveBeenCalledWith('mp4');
      expect(mockCommand.on).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('should set start time when provided', () => {
      const options = { format: 'mp4', startTime: 30 };
      
      FFmpegService.convertStream(mockStream, options);

      expect(mockCommand.seekInput).toHaveBeenCalledWith(30);
    });

    it('should set duration when both start and end times provided', () => {
      const options = { format: 'mp4', startTime: 30, endTime: 90 };
      
      FFmpegService.convertStream(mockStream, options);

      expect(mockCommand.seekInput).toHaveBeenCalledWith(30);
      expect(mockCommand.duration).toHaveBeenCalledWith(60);
    });

    it('should configure audio settings for MP3', () => {
      const options = { format: 'mp3', audioBitrate: '192k' };
      
      FFmpegService.convertStream(mockStream, options);

      expect(mockCommand.format).toHaveBeenCalledWith('mp3');
      expect(mockCommand.audioBitrate).toHaveBeenCalledWith('192k');
      expect(mockCommand.noVideo).toHaveBeenCalled();
    });

    it('should configure audio settings for WAV', () => {
      const options = { format: 'wav', audioBitrate: '320k' };
      
      FFmpegService.convertStream(mockStream, options);

      expect(mockCommand.format).toHaveBeenCalledWith('wav');
      expect(mockCommand.audioBitrate).toHaveBeenCalledWith('320k');
      expect(mockCommand.noVideo).toHaveBeenCalled();
    });

    it('should not set audio bitrate for video formats', () => {
      const options = { format: 'mp4', audioBitrate: '192k' };
      
      FFmpegService.convertStream(mockStream, options);

      expect(mockCommand.audioBitrate).not.toHaveBeenCalled();
      expect(mockCommand.noVideo).not.toHaveBeenCalled();
    });
  });

  describe('getFileExtension', () => {
    it('should return correct extensions for supported formats', () => {
      expect(FFmpegService.getFileExtension('mp4')).toBe('mp4');
      expect(FFmpegService.getFileExtension('webm')).toBe('webm');
      expect(FFmpegService.getFileExtension('avi')).toBe('avi');
      expect(FFmpegService.getFileExtension('mp3')).toBe('mp3');
      expect(FFmpegService.getFileExtension('wav')).toBe('wav');
    });

    it('should return the format itself for unknown formats', () => {
      expect(FFmpegService.getFileExtension('unknown')).toBe('unknown');
    });
  });

  describe('getMimeType', () => {
    it('should return correct MIME types for supported formats', () => {
      expect(FFmpegService.getMimeType('mp4')).toBe('video/mp4');
      expect(FFmpegService.getMimeType('webm')).toBe('video/webm');
      expect(FFmpegService.getMimeType('avi')).toBe('video/x-msvideo');
      expect(FFmpegService.getMimeType('mp3')).toBe('audio/mpeg');
      expect(FFmpegService.getMimeType('wav')).toBe('audio/wav');
    });

    it('should return default MIME type for unknown formats', () => {
      expect(FFmpegService.getMimeType('unknown')).toBe('application/octet-stream');
    });
  });
});