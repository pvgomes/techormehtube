/**
 * @jest-environment jsdom
 */

import {
  downloadFromResponse,
  estimateFileSize,
  validateTimeRange,
} from '../../../client/src/utils/download';

// Mock URL.createObjectURL and URL.revokeObjectURL
Object.assign(global, {
  URL: {
    createObjectURL: jest.fn(() => 'mock-url'),
    revokeObjectURL: jest.fn(),
  },
});

describe('Download Utils', () => {
  describe('downloadFromResponse', () => {
    let mockResponse: Partial<Response>;
    let mockLink: Partial<HTMLAnchorElement>;

    beforeEach(() => {
      // Reset mocks
      jest.clearAllMocks();

      // Mock blob
      const mockBlob = new Blob(['test content']);
      mockResponse = {
        blob: jest.fn().mockResolvedValue(mockBlob),
        body: {} as ReadableStream,
      };

      // Mock DOM elements
      mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
      };

      jest.spyOn(document, 'createElement').mockReturnValue(mockLink as HTMLAnchorElement);
      jest.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as HTMLAnchorElement);
      jest.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as HTMLAnchorElement);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should trigger download correctly', async () => {
      await downloadFromResponse(mockResponse as Response, 'test-file.mp4');

      expect(mockResponse.blob).toHaveBeenCalled();
      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.href).toBe('mock-url');
      expect(mockLink.download).toBe('test-file.mp4');
      expect(mockLink.click).toHaveBeenCalled();
      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
    });

    it('should throw error when response has no body', async () => {
      const responseWithoutBody = { ...mockResponse, body: null };

      await expect(
        downloadFromResponse(responseWithoutBody as Response, 'test.mp4')
      ).rejects.toThrow('No response body available for download');
    });
  });

  describe('estimateFileSize', () => {
    it('should estimate video file sizes correctly', () => {
      const testCases = [
        { duration: 60, format: 'mp4', quality: '1080p', expected: '60 MB' },
        { duration: 120, format: 'mp4', quality: '720p', expected: '75 MB' },
        { duration: 30, format: 'webm', quality: '720p', expected: '15 MB' },
        { duration: 180, format: 'avi', quality: '720p', expected: '225 MB' },
      ];

      testCases.forEach(({ duration, format, quality, expected }) => {
        expect(estimateFileSize(duration, format, quality)).toBe(expected);
      });
    });

    it('should estimate audio file sizes correctly', () => {
      const testCases = [
        { duration: 180, format: 'mp3', expected: '4 MB' },
        { duration: 60, format: 'wav', expected: '10 MB' },
        { duration: 300, format: 'mp3', expected: '7 MB' },
      ];

      testCases.forEach(({ duration, format, expected }) => {
        expect(estimateFileSize(duration, format)).toBe(expected);
      });
    });

    it('should handle small file sizes in KB', () => {
      expect(estimateFileSize(10, 'mp3')).toBe('240 KB');
    });

    it('should handle large file sizes in GB', () => {
      expect(estimateFileSize(7200, 'mp4', '1080p')).toBe('7.0 GB'); // 2 hours
    });
  });

  describe('validateTimeRange', () => {
    it('should validate correct time ranges', () => {
      const validCases = [
        { startTime: undefined, endTime: undefined },
        { startTime: 0, endTime: 60 },
        { startTime: 30, endTime: 90, videoDuration: 120 },
        { startTime: 0, endTime: undefined },
        { startTime: undefined, endTime: 60 },
      ];

      validCases.forEach(({ startTime, endTime, videoDuration }) => {
        const result = validateTimeRange(startTime, endTime, videoDuration);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject negative start time', () => {
      const result = validateTimeRange(-5, 60);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Start time cannot be negative');
    });

    it('should reject negative end time', () => {
      const result = validateTimeRange(10, -5);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('End time cannot be negative');
    });

    it('should reject end time before or equal to start time', () => {
      const cases = [
        { startTime: 60, endTime: 30 },
        { startTime: 60, endTime: 60 },
      ];

      cases.forEach(({ startTime, endTime }) => {
        const result = validateTimeRange(startTime, endTime);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('End time must be greater than start time');
      });
    });

    it('should reject end time exceeding video duration', () => {
      const result = validateTimeRange(10, 150, 120);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('End time cannot exceed video duration');
    });

    it('should reject start time exceeding video duration', () => {
      const result = validateTimeRange(150, undefined, 120);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Start time cannot exceed video duration');
    });
  });
});