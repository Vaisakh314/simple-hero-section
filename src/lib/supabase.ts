/**
 * Custom Supabase client that uses jiobase.com proxy instead of supabase.co
 * (supabase.co is blocked in India)
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || "").replace("supabase.co", "jiobase.com");
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
