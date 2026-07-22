// Environment configuration
export const env = {
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  API_URL: process.env.EXPO_PUBLIC_API_URL || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
