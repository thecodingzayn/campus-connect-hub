## School Management System Plan

This plan outlines the development of a school management system with distinct portals for administrators, staff, students, and parents.

### Phase 1: Core Structure and User Management

1.  **User Authentication and Authorization**: Implement a secure system for user login and role-based access control.
2.  **Portal Routing**: Based on the user's role, redirect them to their respective portal.
3.  **Admin Portal**:
    *   User management (add, edit, delete admin, staff, students, parents)
    *   School settings configuration
4.  **Staff Portal**:
    *   Class management
    *   Student grade management
    *   Timetable management
    *   Attendance tracking
5.  **Student Portal**:
    *   View grades
    *   View timetable
    *   View attendance
    *   Access school announcements
6.  **Parent Portal**:
    *   View child's grades
    *   View child's attendance
    *   View child's timetable
    *   Receive school announcements

### Phase 2: Feature Expansion (Details to be defined in subsequent iterations)

*   **Communication System**: Messaging between users.
*   **Event Management**: School events calendar.
*   **Resource Management**: Library, labs.
*   **Fee Management**: Payment and tracking.

### Tools and Technologies:

*   Frontend: React/Vue/Angular (to be decided by frontend engineer)
*   Backend: Node.js/Python/Go (to be decided by backend engineer)
*   Database: PostgreSQL/MySQL (to be decided by backend engineer)

The frontend engineer will be responsible for generating initial UI mockups and the basic navigation structure for each portal. They must use the `generate_images_bulk` tool first.