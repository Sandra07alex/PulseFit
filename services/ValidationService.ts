export const ValidationService = {
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },

  isValidPassword(password: string): boolean {
    return password.length >= 6;
  },

  isNonEmptyString(value?: string | null): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  },

  isValidNumberRange(val: number, min: number, max: number): boolean {
    return typeof val === 'number' && !isNaN(val) && val >= min && val <= max;
  },
};
