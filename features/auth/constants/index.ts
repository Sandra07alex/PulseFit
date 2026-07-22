// Auth constants
export const AUTH_ERRORS = {
  INVALID_EMAIL: 'Invalid email address',
  WEAK_PASSWORD: 'Password must be at least 8 characters',
  USER_NOT_FOUND: 'User not found',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_IN_USE: 'Email already in use',
} as const;

export const AUTH_MESSAGES = {
  SIGNUP_SUCCESS: 'Account created successfully',
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  PASSWORD_RESET_SENT: 'Password reset link sent to your email',
} as const;
