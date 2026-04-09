import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ponqpceymsxshcbkramn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvbnFwY2V5bXN4c2hjYmtyYW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NDIwMzUsImV4cCI6MjA5MTMxODAzNX0.GAddTyJbFYVTaWDKJuZSrq2lYpv6G301T1mvmkl-vCI';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to handle email/password sign in
// This aligns with the expected function name in some project contexts
export const signInWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};