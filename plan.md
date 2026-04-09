1. **Update `src/types/index.ts`**:
   - Add `Notification` interface to support real-time alerts across the app.
   - Ensure other types like `Announcement`, `Grade`, `AttendanceRecord` are robust for real-time usage.

2. **Update `src/App.tsx`**:
   - Implement a global Supabase real-time subscription for a `notifications` table.
   - When a new notification is inserted, trigger a `toast` using `sonner` to alert the user immediately.
   - Ensure the subscription is cleaned up on unmount or logout.

3. **Update Dashboards with Real-time Logic**:
   - **`AdminDashboard.tsx`**: Subscribe to `profiles` and `announcements` tables. Update the "Recent Registrations" list and stats in real-time when new users are added or modified.
   - **`StaffDashboard.tsx`**: Subscribe to `attendance` and `announcements`. Show live updates when students check-in or when school-wide news is posted.
   - **`StudentDashboard.tsx`**: Subscribe to `grades` and `announcements`. Provide immediate feedback when a teacher posts a new grade or an update to the school calendar.
   - **`ParentDashboard.tsx`**: Subscribe to `grades`, `attendance`, and `announcements` specifically for their child's data.

4. **Enhance UI with Animations**:
   - Wrap dynamic lists in `AnimatePresence` from `framer-motion`.
   - Use `motion.div` for list items to animate them in when real-time updates occur.

5. **Verification**:
   - Ensure the application still functions correctly with demo credentials.
   - Verify that real-time listeners are established only when a user is authenticated.
   - Confirm that the UI reflects data changes smoothly without full page reloads.