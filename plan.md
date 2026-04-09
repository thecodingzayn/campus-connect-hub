1. **Update `src/lib/constants.ts`**:
   - Add `USER_ROLES` constant to provide a single source of truth for user roles.

2. **Update `src/App.tsx`**:
   - Integrate `react-router-dom` for routing.
   - Define specific routes: `/admin`, `/staff`, `/student`, `/parent`, and `/login`.
   - Implement `ProtectedRoute` logic to ensure only users with the correct role can access their respective dashboard.
   - Add logic to automatically redirect users to their role-specific route upon login or if they access the root path while authenticated.
   - Ensure `DashboardLayout` correctly wraps the dashboard content for each role.

3. **Update `src/pages/Login.tsx`**:
   - Ensure the `onLogin` callback is correctly triggered. (The current implementation in `App.tsx` will handle the navigation after state updates).
   - Ensure the `DEMO_CREDENTIALS` are used correctly to simulate a login and trigger the redirection.

4. **Verification**:
   - Test login as Admin, Staff, Student, and Parent.
   - Verify that successful login redirects to the correct URL (e.g., `/admin`).
   - Verify that manual navigation to a different role's dashboard (e.g., a student trying to go to `/admin`) redirects back to their own dashboard or login.
   - Verify that logout takes the user back to `/login`.