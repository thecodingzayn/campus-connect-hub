import { UserRole } from '@/types';

export const IMAGES = {
  LOGO: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/adb6e234-216e-4c1a-a6b9-0e8fe9d9a70a/school-logo-02490a84-1775723424255.webp',
  HERO: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/adb6e234-216e-4c1a-a6b9-0e8fe9d9a70a/school-hero-image-66c20eaf-1775723424325.webp',
  STAFF: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/adb6e234-216e-4c1a-a6b9-0e8fe9d9a70a/staff-avatar-6df7a8a8-1775723424680.webp',
  STUDENT: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/adb6e234-216e-4c1a-a6b9-0e8fe9d9a70a/student-avatar-1e960e96-1775723425356.webp',
  PARENT: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/adb6e234-216e-4c1a-a6b9-0e8fe9d9a70a/parent-avatar-b3125f4b-1775723424940.webp'
};

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Logged in successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  ROLE_MISMATCH: 'You do not have permission to access this portal.',
  GENERIC_ERROR: 'An error occurred during authentication.',
  REQUIRED_FIELDS: 'Please enter both email and password.',
  SELECT_PORTAL: 'Please select a portal first.',
};

export const DEMO_CREDENTIALS = [
  { role: 'admin', email: 'admin@school.com', password: 'password123' },
  { role: 'staff', email: 'staff@school.com', password: 'password123' },
  { role: 'student', email: 'student@school.com', password: 'password123' },
  { role: 'parent', email: 'parent@school.com', password: 'password123' },
];

export const USER_ROLES: Record<string, UserRole> = {
  ADMIN: 'admin',
  STAFF: 'staff',
  STUDENT: 'student',
  PARENT: 'parent',
};