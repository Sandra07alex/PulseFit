// Auth types
export interface AuthError {
  code: string;
  message: string;
}

export interface AuthResponse {
  success: boolean;
  error?: AuthError;
}
