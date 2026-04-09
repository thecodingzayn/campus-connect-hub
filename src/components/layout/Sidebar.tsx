import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  ClipboardList, 
  GraduationCap, 
  Bell, 
  Settings,
  LogOut,
  UserCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, setActiveTab, onLogout }) => {
  const menuItems = {
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'users', label: 'User Management', icon: Users },
      { id: 'classes', label: 'Classes', icon: BookOpen },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
    staff: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'attendance', label: 'Attendance', icon: ClipboardList },
      { id: 'grades', label: 'Gradebook', icon: GraduationCap },
      { id: 'timetable', label: 'Timetable', icon: Calendar },
    ],
    student: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'grades', label: 'My Grades', icon: GraduationCap },
      { id: 'timetable', label: 'Timetable', icon: Calendar },
      { id: 'announcements', label: 'Announcements', icon: Bell },
    ],
    parent: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'progress', label: 'Child Progress', icon: GraduationCap },
      { id: 'attendance', label: 'Attendance', icon: ClipboardList },
      { id: 'fees', label: 'Fee Status', icon: BookOpen },
    ],
  };

  const currentMenu = menuItems[role] || [];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <BookOpen size={20} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">EduFlow</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {currentMenu.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
              activeTab === item.id 
                ? "bg-blue-600 text-white" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <button 
          onClick={() => setActiveTab('profile')}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors"
        >
          <UserCircle size={20} />
          <span className="font-medium">Profile</span>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;