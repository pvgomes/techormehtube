import { ApiService } from '../../../client/src/services/api';

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getVideoInfo', () => {
    it('should return video info on successful request', async () => {
      const mockVideoInfo = {
        videoId: 'dQw4w9WgXcQ',
        title: 'Never Gonna Give You Up',
        duration: '213',
        videoFormats: [],
        audioFormats: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockVideoInfo),
      } as any);

      const result = await ApiService.getVideoInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

      expect(mockFetch).toHaveBeenCalledWith('/api/video-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }),
      });
      expect(result).toEqual(mockVideoInfo);
    });

    it('should throw error on failed request', async () => {
      const mockError = { message: 'Invalid YouTube URL' };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValue(mockError),
      } as any);

      await expect(
        ApiService.getVideoInfo('invalid-url')
      ).rejects.toThrow('Invalid YouTube URL');
    });

    it('should handle network errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockRejectedValue(new Error('Network error')),
      } as any);

      await expect(
        ApiService.getVideoInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
      ).rejects.toThrow('Failed to get video info');
    });
  });

  describe('downloadFile', () => {
    it('should return response on successful download request', async () => {
      const downloadRequest = {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        format: 'mp4',
        quality: '720p',
      };

      const mockResponse = {
        ok: true,
        blob: jest.fn().mockResolvedValue(new Blob(['test'])),
      };

      mockFetch.mockResolvedValueOnce(mockResponse as any);

      const result = await ApiService.downloadFile(downloadRequest);

      expect(mockFetch).toHaveBeenCalledWith('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(downloadRequest),
      });
      expect(result).toBe(mockResponse);
    });

    it('should throw error on failed download', async () => {
      const downloadRequest = {
        url: 'invalid-url',
        format: 'mp4',
        quality: '720p',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Download failed' }),
      } as any);

      await expect(
        ApiService.downloadFile(downloadRequest)
      ).rejects.toThrow('Download failed');
    });
  });

  describe('getHealthStatus', () => {
    it('should return health status', async () => {
      const mockHealthStatus = {
        status: 'ok',
        timestamp: '2023-01-01T00:00:00.000Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockHealthStatus),
      } as any);

      const result = await ApiService.getHealthStatus();

      expect(mockFetch).toHaveBeenCalledWith('/api/health');
      expect(result).toEqual(mockHealthStatus);
    });

    it('should throw error on failed health check', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as any);

      await expect(ApiService.getHealthStatus()).rejects.toThrow('Health check failed');
    });
  });

  describe('getStats', () => {
    it('should return system stats', async () => {
      const mockStats = {
        status: 'running',
        timestamp: '2023-01-01T00:00:00.000Z',
        uptime: 3600,
        memory: { used: 1000000, total: 2000000 },
        version: 'v18.0.0',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockStats),
      } as any);

      const result = await ApiService.getStats();

      expect(mockFetch).toHaveBeenCalledWith('/api/stats');
      expect(result).toEqual(mockStats);
    });

    it('should throw error on failed stats request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as any);

      await expect(ApiService.getStats()).rejects.toThrow('Failed to get stats');
    });
  });
});