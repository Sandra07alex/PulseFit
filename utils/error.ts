export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'STORAGE_ERROR'
  | 'UNKNOWN_ERROR';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, any>;

  constructor(message: string, code: ErrorCode = 'UNKNOWN_ERROR', statusCode: number = 500, details?: Record<string, any>) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export async function safeExecute<T>(fn: () => Promise<T>, fallbackValue: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error('[SafeExecute Error]', err);
    return fallbackValue;
  }
}
