export type UserRole = 'admin' | 'staff' | 'student' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface Grade {
  subject: string;
  score: number;
  grade: string;
  teacher: string;
}

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late';
  subject: string;
}

export interface TimetableEntry {
  day: string;
  time: string;
  subject: string;
  room: string;
}