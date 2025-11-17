import { formatCurrency } from '../formatCurrency';

describe('formatCurrency', () => {
  it('should format number with default locale and currency', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should format negative numbers', () => {
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
  });

  it('should format zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should format with different locale', () => {
    expect(formatCurrency(1234.56, 'de-DE', 'EUR')).toBe('1.234,56 €');
  });

  it('should handle decimal places correctly', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
    expect(formatCurrency(1234.567)).toBe('$1,234.57');
  });

  it('should handle large numbers', () => {
    expect(formatCurrency(1234567890.99)).toBe('$1,234,567,890.99');
  });
});
