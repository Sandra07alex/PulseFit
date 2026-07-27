/**
 * Generic Result type for handling success/failure in an elegant, 
 * typed manner without throwing exceptions into the UI.
 */
export type Result<T> =
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: Error };
