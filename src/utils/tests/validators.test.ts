import { isValidEmail, sanitizeText, sanitizeEmailSubject, isValidName } from '../validators';

describe('Validators', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test.example.com')).toBe(false);
    });

    it('should reject emails with spaces', () => {
      expect(isValidEmail('test @example.com')).toBe(false);
      expect(isValidEmail('test@ example.com')).toBe(false);
      expect(isValidEmail('test@example .com')).toBe(false);
    });
  });

  describe('sanitizeText', () => {
    it('should remove HTML brackets', () => {
      expect(sanitizeText('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
    });

    it('should replace newlines with spaces', () => {
      expect(sanitizeText('line1\n\nline2')).toBe('line1 line2');
    });

    it('should trim whitespace', () => {
      expect(sanitizeText('  text  ')).toBe('text');
    });

    it('should handle empty input', () => {
      expect(sanitizeText('')).toBe('');
    });
  });

  describe('sanitizeEmailSubject', () => {
    it('should remove newlines', () => {
      expect(sanitizeEmailSubject('subject\n\ninjection')).toBe('subjectinjection');
    });

    it('should remove non-ASCII characters', () => {
      expect(sanitizeEmailSubject('subject€')).toBe('subject');
    });

    it('should limit length to 100 characters', () => {
      const longSubject = 'a'.repeat(150);
      expect(sanitizeEmailSubject(longSubject)).toHaveLength(100);
    });

    it('should handle empty input', () => {
      expect(sanitizeEmailSubject('')).toBe('');
    });
  });

  describe('isValidName', () => {
    it('should validate correct names', () => {
      expect(isValidName('John Doe')).toBe(true);
      expect(isValidName("Mary-Jane O'Connor")).toBe(true);
      expect(isValidName('Jean-Luc')).toBe(true);
    });

    it('should reject names with invalid characters', () => {
      expect(isValidName('John123')).toBe(false);
      expect(isValidName('John@Doe')).toBe(false);
      expect(isValidName('John.Doe')).toBe(false);
    });

    it('should enforce length limits', () => {
      expect(isValidName('J')).toBe(false); // Too short
      const longName = 'a'.repeat(101);
      expect(isValidName(longName)).toBe(false); // Too long
    });

    it('should handle empty input', () => {
      expect(isValidName('')).toBe(false);
    });
  });
});
