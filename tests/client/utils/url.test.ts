import {
  isValidYouTubeUrl,
  extractVideoId,
  sanitizeFilename,
  formatDuration,
  parseDuration,
} from '../../../client/src/utils/url';

describe('URL Utils', () => {
  describe('isValidYouTubeUrl', () => {
    it('should validate YouTube URLs correctly', () => {
      const validUrls = [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://youtube.com/watch?v=dQw4w9WgXcQ',
        'https://youtu.be/dQw4w9WgXcQ',
        'http://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'www.youtube.com/watch?v=dQw4w9WgXcQ',
        'youtube.com/watch?v=dQw4w9WgXcQ',
        'youtu.be/dQw4w9WgXcQ',
      ];

      validUrls.forEach(url => {
        expect(isValidYouTubeUrl(url)).toBe(true);
      });
    });

    it('should reject invalid URLs', () => {
      const invalidUrls = [
        'https://vimeo.com/123456',
        'https://example.com',
        'not-a-url',
        'https://youtube.com/invalid',
        '',
        null,
        undefined,
        123,
      ];

      invalidUrls.forEach(url => {
        expect(isValidYouTubeUrl(url as any)).toBe(false);
      });
    });
  });

  describe('extractVideoId', () => {
    it('should extract video ID from valid YouTube URLs', () => {
      const testCases = [
        { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', expected: 'dQw4w9WgXcQ' },
        { url: 'https://youtu.be/dQw4w9WgXcQ', expected: 'dQw4w9WgXcQ' },
        { url: 'https://youtube.com/watch?v=abc123&t=30s', expected: 'abc123' },
        { url: 'https://www.youtube.com/watch?v=XYZ789', expected: 'XYZ789' },
      ];

      testCases.forEach(({ url, expected }) => {
        expect(extractVideoId(url)).toBe(expected);
      });
    });

    it('should return null for invalid URLs', () => {
      const invalidUrls = [
        'https://vimeo.com/123456',
        'https://example.com',
        'not-a-url',
        '',
      ];

      invalidUrls.forEach(url => {
        expect(extractVideoId(url)).toBeNull();
      });
    });
  });

  describe('sanitizeFilename', () => {
    it('should sanitize filenames correctly', () => {
      const testCases = [
        { input: 'Normal Video Title', expected: 'Normal_Video_Title' },
        { input: 'Video: With Special Characters!', expected: 'Video_With_Special_Characters_' },
        { input: 'Video   with    multiple   spaces', expected: 'Video_with_multiple_spaces' },
        { input: 'Video/\\with|illegal<>characters', expected: 'Video_with_illegal_characters' },
        { input: 'Video___with___underscores', expected: 'Video_with_underscores' },
        { input: '  Trimmed  ', expected: 'Trimmed' },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(sanitizeFilename(input)).toBe(expected);
      });
    });
  });

  describe('formatDuration', () => {
    it('should format duration correctly', () => {
      const testCases = [
        { input: 0, expected: '0:00' },
        { input: 30, expected: '0:30' },
        { input: 60, expected: '1:00' },
        { input: 90, expected: '1:30' },
        { input: 3661, expected: '61:01' },
        { input: 125, expected: '2:05' },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(formatDuration(input)).toBe(expected);
      });
    });
  });

  describe('parseDuration', () => {
    it('should parse MM:SS format correctly', () => {
      const testCases = [
        { input: '0:00', expected: 0 },
        { input: '0:30', expected: 30 },
        { input: '1:00', expected: 60 },
        { input: '1:30', expected: 90 },
        { input: '10:05', expected: 605 },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(parseDuration(input)).toBe(expected);
      });
    });

    it('should parse HH:MM:SS format correctly', () => {
      const testCases = [
        { input: '1:00:00', expected: 3600 },
        { input: '1:30:45', expected: 5445 },
        { input: '0:05:30', expected: 330 },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(parseDuration(input)).toBe(expected);
      });
    });

    it('should return 0 for invalid formats', () => {
      const invalidInputs = ['invalid', '1', '1:2:3:4', ''];
      
      invalidInputs.forEach(input => {
        expect(parseDuration(input)).toBe(0);
      });
    });
  });
});