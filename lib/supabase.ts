// Supabase client initialization
import { createClient } from '@supabase/supabase-js';
import { env } from './environment';
import type { Database } from '~/types/supabase';

export const supabase = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);

export default supabase;
