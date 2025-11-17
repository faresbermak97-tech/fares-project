// Sanitization functions
export function sanitizeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/<|>/g, '')        // remove HTML brackets
    .replace(/\n+/g, ' ')       // replace newlines
    .trim();
}

export function sanitizeEmailSubject(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\r\n]/g, '')      // remove newlines
    .replace(/[^ -~]/g, '')      // remove non-ASCII
    .slice(0, 100);              // limit length
}

// Name validator
export function isValidName(name: string): boolean {
  if (!name) return false;
  if (name.length < 2 || name.length > 100) return false;

  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
  return regex.test(name);
}

// Email validator
export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
