import { YouTubeService } from '../../../server/services/youtube';

// Mock ytdl-core
jest.mock('@distube/ytdl-core', () => ({
  validateURL: jest.fn(),
  getInfo: jest.fn(),
  default: jest.fn(),
}));

import ytdl from '@distube/ytdl-core';

const mockYtdl = ytdl as jest.Mocked<typeof ytdl>;

describe('YouTubeService', () => {
  describe('validateUrl', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should validate YouTube URLs correctly', () => {
      (mockYtdl.validateURL as jest.Mock).mockReturnValue(true);
      
      const validUrls = [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://youtube.com/watch?v=dQw4w9WgXcQ',
        'https://youtu.be/dQw4w9WgXcQ',
        'http://www.youtube.com/watch?v=dQw4w9WgXcQ',
      ];

      validUrls.forEach(url => {
        expect(YouTubeService.validateUrl(url)).toBe(true);
      });
    });

    it('should reject invalid URLs', () => {
      (mockYtdl.validateURL as jest.Mock).mockReturnValue(false);
      
      const invalidUrls = [
        'https://example.com',
        'not-a-url',
        'https://vimeo.com/123456',
        'https://youtube.com/invalid',
      ];

      invalidUrls.forEach(url => {
        expect(YouTubeService.validateUrl(url)).toBe(false);
      });
    });
  });

  describe('getVideoInfo', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return video info for valid URL', async () => {
      const mockVideoInfo = {
        videoDetails: {
          videoId: 'dQw4w9WgXcQ',
          title: 'Never Gonna Give You Up',
          description: 'Rick Astley - Never Gonna Give You Up',
          lengthSeconds: '213',
          viewCount: '1000000',
          author: { name: 'RickAstleyVEVO' },
          thumbnails: [
            { url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg' }
          ],
        },
        formats: [
          {
            itag: 18,
            container: 'mp4',
            quality: 'medium',
            qualityLabel: '360p',
            hasAudio: true,
            hasVideo: true,
          },
          {
            itag: 140,
            container: 'mp4',
            quality: 'tiny',
            hasAudio: true,
            hasVideo: false,
            audioBitrate: 128,
            audioQuality: 'AUDIO_QUALITY_MEDIUM',
            contentLength: '1234567',
          }
        ]
      };

      (mockYtdl.validateURL as jest.Mock).mockReturnValue(true);
      (mockYtdl.getInfo as jest.Mock).mockResolvedValue(mockVideoInfo);

      const result = await YouTubeService.getVideoInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

      expect(result).toEqual({
        videoId: 'dQw4w9WgXcQ',
        title: 'Never Gonna Give You Up',
        description: 'Rick Astley - Never Gonna Give You Up',
        duration: '213',
        views: '1000000',
        channel: 'RickAstleyVEVO',
        thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        videoFormats: [{
          itag: 18,
          container: 'mp4',
          quality: 'medium',
          qualityLabel: '360p',
          hasAudio: true,
          hasVideo: true,
        }],
        audioFormats: [{
          itag: 140,
          container: 'mp4',
          quality: 'tiny',
          audioBitrate: 128,
          audioQuality: 'AUDIO_QUALITY_MEDIUM',
          contentLength: '1234567',
        }]
      });
    });

    it('should throw error for invalid URL', async () => {
      (mockYtdl.validateURL as jest.Mock).mockReturnValue(false);

      await expect(
        YouTubeService.getVideoInfo('https://invalid-url.com')
      ).rejects.toThrow('Invalid YouTube URL');
    });

    it('should throw error for videos longer than 10 minutes', async () => {
      const mockVideoInfo = {
        videoDetails: {
          videoId: 'long-video',
          title: 'Long Video',
          description: 'A very long video',
          lengthSeconds: '700', // More than 600 seconds (10 minutes)
          viewCount: '1000',
          author: { name: 'Test Channel' },
          thumbnails: [{ url: 'https://example.com/thumb.jpg' }],
        },
        formats: []
      };

      (mockYtdl.validateURL as jest.Mock).mockReturnValue(true);
      (mockYtdl.getInfo as jest.Mock).mockResolvedValue(mockVideoInfo);

      await expect(
        YouTubeService.getVideoInfo('https://www.youtube.com/watch?v=long-video')
      ).rejects.toThrow('Video duration exceeds 10 minutes limit');
    });
  });

  describe('getDownloadStream', () => {
    it('should create download stream for valid URL', () => {
      (mockYtdl.validateURL as jest.Mock).mockReturnValue(true);
      const mockStream = { pipe: jest.fn() };
      (mockYtdl as any).mockReturnValue(mockStream);

      const options = { quality: 'highest' };
      const result = YouTubeService.getDownloadStream('https://www.youtube.com/watch?v=dQw4w9WgXcQ', options);

      expect(mockYtdl).toHaveBeenCalledWith('https://www.youtube.com/watch?v=dQw4w9WgXcQ', options);
      expect(result).toBe(mockStream);
    });

    it('should throw error for invalid URL', () => {
      (mockYtdl.validateURL as jest.Mock).mockReturnValue(false);

      expect(() => {
        YouTubeService.getDownloadStream('https://invalid-url.com', {});
      }).toThrow('Invalid YouTube URL');
    });
  });
});