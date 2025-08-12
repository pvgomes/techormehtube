import { videoInfoSchema, downloadSchema, validateTimeRange } from '../../../server/utils/validation';

describe('Validation Utils', () => {
  describe('videoInfoSchema', () => {
    it('should validate valid video info request', () => {
      const validData = {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      };

      const result = videoInfoSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it('should reject invalid URLs', () => {
      const invalidData = {
        url: 'not-a-url'
      };

      expect(() => videoInfoSchema.parse(invalidData)).toThrow();
    });

    it('should reject missing URL', () => {
      const invalidData = {};

      expect(() => videoInfoSchema.parse(invalidData)).toThrow();
    });
  });

  describe('downloadSchema', () => {
    it('should validate valid download request', () => {
      const validData = {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        format: 'mp4',
        quality: '720p',
        startTime: 10,
        endTime: 60
      };

      const result = downloadSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it('should validate request without time range', () => {
      const validData = {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        format: 'mp3',
        quality: '128kbps'
      };

      const result = downloadSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it('should reject invalid format', () => {
      const invalidData = {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        format: 'invalid-format',
        quality: '720p'
      };

      expect(() => downloadSchema.parse(invalidData)).toThrow();
    });

    it('should reject negative start time', () => {
      const invalidData = {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        format: 'mp4',
        quality: '720p',
        startTime: -5
      };

      expect(() => downloadSchema.parse(invalidData)).toThrow();
    });

    it('should reject end time before start time', () => {
      const invalidData = {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        format: 'mp4',
        quality: '720p',
        startTime: 60,
        endTime: 30
      };

      expect(() => downloadSchema.parse(invalidData)).toThrow();
    });
  });

  describe('validateTimeRange', () => {
    it('should validate valid time range', () => {
      expect(() => validateTimeRange(10, 60, 120)).not.toThrow();
    });

    it('should validate undefined times', () => {
      expect(() => validateTimeRange()).not.toThrow();
      expect(() => validateTimeRange(undefined, undefined, 120)).not.toThrow();
    });

    it('should throw error for negative start time', () => {
      expect(() => validateTimeRange(-5, 60, 120)).toThrow('Start time cannot be negative');
    });

    it('should throw error for negative end time', () => {
      expect(() => validateTimeRange(10, -5, 120)).toThrow('End time cannot be negative');
    });

    it('should throw error when end time is before start time', () => {
      expect(() => validateTimeRange(60, 30, 120)).toThrow('End time must be greater than start time');
    });

    it('should throw error when end time equals start time', () => {
      expect(() => validateTimeRange(30, 30, 120)).toThrow('End time must be greater than start time');
    });

    it('should throw error when end time exceeds video duration', () => {
      expect(() => validateTimeRange(10, 150, 120)).toThrow('End time cannot exceed video duration');
    });
  });
});