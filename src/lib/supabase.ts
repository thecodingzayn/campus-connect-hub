import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ponqpceymsxshcbkramn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvbnFwY2V5bXN4c2hjYmtyYW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NDIwMzUsImV4cCI6MjA5MTMxODAzNX0.GAddTyJbFYVTaWDKJuZSrq2lYpv6G301T1mvmkl-vCI';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to handle email/password sign in
export const signInWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

// --- CRUD OPERATIONS ---

// Announcements
export const createAnnouncement = async (announcement: any) => {
  return await supabase.from('announcements').insert(announcement).select();
};

export const updateAnnouncement = async (id: string, updates: any) => {
  return await supabase.from('announcements').update(updates).eq('id', id).select();
};

export const deleteAnnouncement = async (id: string) => {
  return await supabase.from('announcements').delete().eq('id', id);
};

// Grades
export const createGrade = async (grade: any) => {
  return await supabase.from('grades').insert(grade).select();
};

export const updateGrade = async (id: string, updates: any) => {
  return await supabase.from('grades').update(updates).eq('id', id).select();
};

export const deleteGrade = async (id: string) => {
  return await supabase.from('grades').delete().eq('id', id);
};

// Profiles (Students, Staff, Parents)
export const createProfile = async (profile: any) => {
  return await supabase.from('profiles').insert(profile).select();
};

export const updateProfile = async (id: string, updates: any) => {
  return await supabase.from('profiles').update(updates).eq('id', id).select();
};

export const deleteProfile = async (id: string) => {
  return await supabase.from('profiles').delete().eq('id', id);
};

// Courses
export const createCourse = async (course: any) => {
  return await supabase.from('courses').insert(course).select();
};

export const updateCourse = async (id: string, updates: any) => {
  return await supabase.from('courses').update(updates).eq('id', id).select();
};

export const deleteCourse = async (id: string) => {
  return await supabase.from('courses').delete().eq('id', id);
};

// Attendance
export const createAttendance = async (record: any) => {
  return await supabase.from('attendance').insert(record).select();
};

export const updateAttendance = async (id: string, updates: any) => {
  return await supabase.from('attendance').update(updates).eq('id', id).select();
};