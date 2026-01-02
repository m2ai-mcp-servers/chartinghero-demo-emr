import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[DEBUG] Supabase URL configured:', !!supabaseUrl);
console.log('[DEBUG] Supabase Key configured:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Using local JSON fallback.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

console.log('[DEBUG] Supabase client created:', !!supabase);

export const isSupabaseConfigured = () => !!supabase;
