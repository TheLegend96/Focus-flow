import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://uokipjqgcexcvpilpwrz.supabase.co';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVva2lwanFnY2V4Y3ZwaWxwd3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1MDk1MzcsImV4cCI6MjEwODA4NTUzN30.EV2xbVu7dEh20hpoqx23d98650fNg0SRake2yfx7s9Y';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
