import { youtubeUrlSchema, downloadRequestSchema } from '../../shared/schema';

describe('Shared Schema Validation', () => {
  describe('youtubeUrlSchema', () => {
    it('should validate valid YouTube URLs', () => {
      const validUrls = [
        { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { url: 'https://youtube.com/watch?v=dQw4w9WgXcQ' },
        { url: 'https://youtu.be/dQw4w9WgXcQ' },
        { url: 'http://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      ];

      validUrls.forEach(data => {
        expect(() => youtubeUrlSchema.parse(data)).not.toThrow();
      });
    });

    it('should reject invalid URLs', () => {
      const invalidUrls = [
        { url: 'https://vimeo.com/123456' },
        { url: 'https://example.com' },
        { url: 'not-a-url' },
        { url: 'https://youtube.com/invalid-path' },
      ];

      invalidUrls.forEach(data => {
        expect(() => youtubeUrlSchema.parse(data)).toThrow();
      });
    });

    it('should reject missing URL', () => {
      expect(() => youtubeUrlSchema.parse({})).toThrow();
    });
  });

  describe('downloadRequestSchema', () => {
    it('should validate complete download request', () => {
      const validRequest = {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        format: 'mp4',
        quality: '720p',
        startTime: 10,
        endTime: 60
      };

      expect(() => downloadRequestSchema.parse(validRequest)).not.toThrow();
    });

    it('should validate request without time range', () => {
      const validRequest = {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        format: 'mp3',
        quality: '128kbps'
      };

      expect(() => downloadRequestSchema.parse(validRequest)).not.toThrow();
    });

    it('should validate all supported formats', () => {
      const formats = ['mp4', 'webm', 'avi', 'mp3', 'wav', 'm4a'];
      
      formats.forEach(format => {
        const request = {
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          format,
          quality: '720p'
        };
        
        expect(() => downloadRequestSchema.parse(request)).not.toThrow();
      });
    });

    it('should reject invalid format', () => {
      const invalidRequest = {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        format: 'invalid',
        quality: '720p'
      };

      expect(() => downloadRequestSchema.parse(invalidRequest)).toThrow();
    });

    it('should reject negative times', () => {
      const invalidRequests = [
        {
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          format: 'mp4',
          quality: '720p',
          startTime: -5
        },
        {
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          format: 'mp4', 
          quality: '720p',
          endTime: -10
        }
      ];

      invalidRequests.forEach(request => {
        expect(() => downloadRequestSchema.parse(request)).toThrow();
      });
    });

    it('should reject missing required fields', () => {
      const incompleteRequests = [
        { format: 'mp4', quality: '720p' }, // missing url
        { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', quality: '720p' }, // missing format
        { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', format: 'mp4' }, // missing quality
      ];

      incompleteRequests.forEach(request => {
        expect(() => downloadRequestSchema.parse(request)).toThrow();
      });
    });
  });
});