import { generateId } from '../generateId';

describe('generateId', () => {
  it('should generate ID with default length', () => {
    const id = generateId();
    expect(id).toHaveLength(8);
  });

  it('should generate ID with custom length', () => {
    const id = generateId(12);
    expect(id).toHaveLength(12);
  });

  it('should generate different IDs on multiple calls', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('should generate ID with only allowed characters', () => {
    const id = generateId();
    const allowedChars = /^[A-Za-z0-9]+$/;
    expect(allowedChars.test(id)).toBe(true);
  });

  it('should handle zero length', () => {
    const id = generateId(0);
    expect(id).toHaveLength(0);
  });
});
