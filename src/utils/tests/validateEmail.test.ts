import { validateEmail } from '../validateEmail';

describe('validateEmail', () => {
  it('should validate correct email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(validateEmail('user+tag@example.org')).toBe(true);
  });

  it('should reject invalid email addresses', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('test.example.com')).toBe(false);
  });

  it('should reject emails with spaces', () => {
    expect(validateEmail('test @example.com')).toBe(false);
    expect(validateEmail('test@ example.com')).toBe(false);
    expect(validateEmail('test@example .com')).toBe(false);
  });

  it('should reject emails with multiple @ symbols', () => {
    expect(validateEmail('test@@example.com')).toBe(false);
    expect(validateEmail('te@st@example.com')).toBe(false);
  });
});
