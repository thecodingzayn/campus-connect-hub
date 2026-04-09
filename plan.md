# Supabase Login Integration Plan

This plan outlines the steps to integrate Supabase authentication into the School Management System.

## Phase 1: Supabase Setup
- [x] Install `@supabase/supabase-js`
- [ ] Create `src/lib/supabase.ts` to initialize the Supabase client using environment variables.
- [ ] Update `src/lib/constants.ts` to include common authentication messages.

## Phase 2: Login Page Integration
- [ ] Update `src/pages/Login.tsx` to handle form inputs (email, password).
- [ ] Implement `handleLogin` using `supabase.auth.signInWithPassword`.
- [ ] Add loading states and error handling with `sonner` toasts.
- [ ] Ensure the selected role is passed or used to verify user permissions.

## Phase 3: Authentication State Management
- [ ] Update `src/App.tsx` to include an auth listener (`onAuthStateChange`).
- [ ] Fetch user profile details (name, role, avatar) from the `profiles` table or `user_metadata`.
- [ ] Implement protected routing logic based on authentication state.
- [ ] Handle automatic logout on session expiration.

## Phase 4: Validation
- [ ] Verify successful login redirects to the correct portal.
- [ ] Verify logout clears the session and redirects to the login page.
- [ ] Verify unauthenticated users cannot access dashboard routes.
