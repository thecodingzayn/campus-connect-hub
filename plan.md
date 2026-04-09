1. **Update `src/types/index.ts`**:
   - Add missing interfaces for real-time data: `SchoolStats`, `ScheduleEntry`, `AssignmentSubmission`, `FeeStatus`.

2. **Enhance `src/App.tsx`**:
   - Add a second global subscription for `announcements` to show notifications to all logged-in users.
   - Improve the `user` state initialization to ensure real-time connections are stable.

3. **Update `src/pages/admin/AdminDashboard.tsx`**:
   - Implement real-time stat counters that increment/decrement based on `profiles` and `attendance` table changes.
   - Refine the `recentUsers` table with smoother `framer-motion` transitions.

4. **Update `src/pages/staff/StaffDashboard.tsx`**:
   - Add real-time subscription for `schedules` to reflect changes in the daily routine.
   - Implement live submission tracking for the "Pending Grading" section.
   - Ensure the `students` list updates instantly when attendance is marked (local optimistic update + real-time confirmation).

5. **Update `src/pages/student/StudentDashboard.tsx`**:
   - Add a live "Current Class" ticker that updates based on time and a `schedules` table.
   - Real-time updates for "Upcoming Assignments" based on a new `assignments` table.
   - Use `AnimatePresence` for all list updates.

6. **Update `src/pages/parent/ParentDashboard.tsx`**:
   - Add real-time `payments` subscription to update the "Outstanding Balance" live.
   - Link `children` status directly to the `attendance` table with specific filtering for their child IDs.

7. **Global Live Feed Component**:
   - Create a small floating or sidebar "Live School Feed" in `DashboardLayout` or `Header` to show recent school-wide events.
