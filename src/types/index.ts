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
  type: 'Exams' | 'Events' | 'News' | 'Academic';
}

export interface Grade {
  id: string;
  subject: string;
  score: string;
  trend: 'up' | 'down' | 'stable';
  teacher: string;
  studentId?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  subject: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  user_id?: string;
}

export interface TimetableEntry {
  day: string;
  time: string;
  subject: string;
  room: string;
  status?: 'ongoing' | 'upcoming' | 'completed';
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
}

export interface SchoolStats {
  totalStudents: number;
  totalStaff: number;
  totalClasses: number;
  avgAttendance: string;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
  description: string;
}