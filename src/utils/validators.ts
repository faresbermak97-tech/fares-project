// Name validator
export function isValidName(name: string): boolean {
  if (!name) return false;
  if (name.length < 2 || name.length > 100) return false;

  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
  return regex.test(name);
}

// Email validator
export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
