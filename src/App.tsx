import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { User, UserRole } from '@/types';
import { IMAGES } from '@/lib/constants';
import Login from '@/pages/Login';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import StaffDashboard from '@/pages/staff/StaffDashboard';
import StudentDashboard from '@/pages/student/StudentDashboard';
import ParentDashboard from '@/pages/parent/ParentDashboard';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = (role: UserRole) => {
    const mockUser: User = {
      id: '1',
      name: role === 'admin' ? 'Administrator' : 
            role === 'staff' ? 'Sarah Wilson' : 
            role === 'student' ? 'Marcus Chen' : 'Robert Chen',
      email: `${role}@school.com`,
      role: role,
      avatar: role === 'staff' ? IMAGES.STAFF : 
              role === 'student' ? IMAGES.STUDENT : 
              role === 'parent' ? IMAGES.PARENT : undefined
    };
    
    setUser(mockUser);
    setActiveTab('dashboard');
    toast.success(`Logged in as ${role}`);
  };

  const handleLogout = () => {
    setUser(null);
    toast.info('Logged out successfully');
  };

  if (!user) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster position="top-right" />
      </>
    );
  }

  const renderContent = () => {
    if (activeTab === 'profile') {
      return (
        <div className="p-8 bg-white rounded-2xl shadow-sm max-w-2xl mx-auto mt-12">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden">
              <img src={user.avatar || IMAGES.STUDENT} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-500">Email Address</label>
              <p className="text-slate-900">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Organization</label>
              <p className="text-slate-900">Greenwood High School</p>
            </div>
          </div>
        </div>
      );
    }

    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'staff':
        return <StaffDashboard />;
      case 'student':
        return <StudentDashboard />;
      case 'parent':
        return <ParentDashboard />;
      default:
        return <div>Portal Not Found</div>;
    }
  };

  return (
    <>
      <DashboardLayout 
        user={user} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
      >
        {renderContent()}
      </DashboardLayout>
      <Toaster position="top-right" />
    </>
  );
}

export default App;