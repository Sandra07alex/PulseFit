// Validation utilities
export const validationUtils = {
  /**
   * Validate email
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   */
  isStrongPassword(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonprintableChars = /\W/.test(password);
    const isLengthValid = password.length >= 8;

    return hasUpperCase && hasLowerCase && hasNumbers && isLengthValid;
  },

  /**
   * Validate phone number
   */
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    return phoneRegex.test(phone);
  },

  /**
   * Validate URL
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Check if value is empty
   */
  isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim().length === 0) return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === 'object' && Object.keys(value).length === 0) return true;
    return false;
  },

  /**
   * Validate number range
   */
  isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  },

  /**
   * Validate positive number
   */
  isPositive(value: number): boolean {
    return value > 0;
  },
};
