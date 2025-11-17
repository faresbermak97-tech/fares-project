import { formatTime, formatDate, truncateText } from '../formatters';

describe('Formatters', () => {
  describe('formatTime', () => {
    it('should format time with default timezone and locale', () => {
      const result = formatTime();
      expect(result).toMatch(/^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/);
    });

    it('should format time with custom timezone', () => {
      const result = formatTime('America/New_York');
      expect(result).toMatch(/^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/);
    });

    it('should format time with custom locale', () => {
      const result = formatTime('Africa/Algiers', 'fr-FR');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('formatDate', () => {
    it('should format date string', () => {
      const dateString = '2023-01-01';
      const result = formatDate(dateString);
      expect(result).toMatch(/^(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}$/);
    });

    it('should format Date object', () => {
      const date = new Date('2023-01-01');
      const result = formatDate(date);
      expect(result).toMatch(/^(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}$/);
    });

    it('should format date with custom locale', () => {
      const date = new Date('2023-01-01');
      const result = formatDate(date, 'fr-FR');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('truncateText', () => {
    it('should return original text if shorter than maxLength', () => {
      const text = 'Short text';
      const result = truncateText(text, 20);
      expect(result).toBe(text);
    });

    it('should truncate text longer than maxLength', () => {
      const text = 'This is a very long text that needs to be truncated';
      const result = truncateText(text, 20);
      expect(result).toBe('This is a very lo...');
    });

    it('should handle exact maxLength', () => {
      const text = 'Exactly twenty chars';
      const result = truncateText(text, 20);
      expect(result).toBe(text);
    });

    it('should handle empty text', () => {
      const result = truncateText('', 10);
      expect(result).toBe('');
    });
  });
});
