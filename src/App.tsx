import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { User, UserRole, AppNotification } from '@/types';
import { IMAGES, AUTH_MESSAGES, USER_ROLES } from '@/lib/constants';
import Login from '@/pages/Login';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import StaffDashboard from '@/pages/staff/StaffDashboard';
import StudentDashboard from '@/pages/student/StudentDashboard';
import ParentDashboard from '@/pages/parent/ParentDashboard';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Check for initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await fetchUserProfile(session.user.id, session.user.email || '');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        await fetchUserProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Real-time Global Notifications
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('global-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotif = payload.new as AppNotification;
          toast[newNotif.type || 'info'](newNotif.title, {
            description: newNotif.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      // First attempt to fetch from profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile && !error) {
        setUser({
          id: userId,
          name: profile.name || 'User',
          email: email,
          role: (profile.role as UserRole) || 'student',
          avatar: profile.avatar_url || undefined
        });
      } else {
        // Fallback: try to get role from user_metadata
        const { data: { user: authUser } } = await supabase.auth.getUser();
        const role = (authUser?.user_metadata?.role as UserRole) || 'student';
        const name = authUser?.user_metadata?.full_name || 'User';
        
        setUser({
          id: userId,
          name: name,
          email: email,
          role: role,
          avatar: role === 'staff' ? IMAGES.STAFF : 
                  role === 'student' ? IMAGES.STUDENT : 
                  role === 'parent' ? IMAGES.PARENT : undefined
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleLogin = (role: UserRole) => {
    // Immediate state update for demo users
    if (!user) {
      setUser({
        id: `demo-${role}`,
        name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        email: `${role}@school.com`,
        role: role,
        avatar: role === 'staff' ? IMAGES.STAFF : 
                role === 'student' ? IMAGES.STUDENT : 
                role === 'parent' ? IMAGES.PARENT : undefined
      });
    }
    setActiveTab('dashboard');
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      setUser(null);
      toast.info(AUTH_MESSAGES.LOGOUT_SUCCESS);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading your portal...</p>
        </div>
      </div>
    );
  }

  const ProfilePage = () => (
    <div className="p-8 bg-white rounded-2xl shadow-sm max-w-2xl mx-auto mt-12">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden">
          <img 
            src={user?.avatar || (user?.role === 'staff' ? IMAGES.STAFF : user?.role === 'student' ? IMAGES.STUDENT : IMAGES.PARENT)} 
            alt="Profile" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <p className="text-slate-500 capitalize">{user?.role}</p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-500">Email Address</label>
          <p className="text-slate-900">{user?.email}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-500">Organization</label>
          <p className="text-slate-900">Greenwood High School</p>
        </div>
      </div>
    </div>
  );

  const getDashboardContent = () => {
    if (activeTab === 'profile') return <ProfilePage />;
    
    switch (user?.role) {
      case USER_ROLES.ADMIN: return <AdminDashboard />;
      case USER_ROLES.STAFF: return <StaffDashboard />;
      case USER_ROLES.STUDENT: return <StudentDashboard />;
      case USER_ROLES.PARENT: return <ParentDashboard />;
      default: return <div>Portal Not Found</div>;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to={`/${user.role}`} replace />} 
        />

        <Route 
          path="/admin" 
          element={
            user?.role === USER_ROLES.ADMIN ? (
              <DashboardLayout user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
                {getDashboardContent()}
              </DashboardLayout>
            ) : <Navigate to={user ? `/${user.role}` : "/login"} replace />
          } 
        />
        
        <Route 
          path="/staff" 
          element={
            user?.role === USER_ROLES.STAFF ? (
              <DashboardLayout user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
                {getDashboardContent()}
              </DashboardLayout>
            ) : <Navigate to={user ? `/${user.role}` : "/login"} replace />
          } 
        />

        <Route 
          path="/student" 
          element={
            user?.role === USER_ROLES.STUDENT ? (
              <DashboardLayout user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
                {getDashboardContent()}
              </DashboardLayout>
            ) : <Navigate to={user ? `/${user.role}` : "/login"} replace />
          } 
        />

        <Route 
          path="/parent" 
          element={
            user?.role === USER_ROLES.PARENT ? (
              <DashboardLayout user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
                {getDashboardContent()}
              </DashboardLayout>
            ) : <Navigate to={user ? `/${user.role}` : "/login"} replace />
          } 
        />

        <Route 
          path="/" 
          element={<Navigate to={user ? `/${user.role}` : "/login"} replace />} 
        />

        <Route 
          path="*" 
          element={<Navigate to={user ? `/${user.role}` : "/login"} replace />} 
        />
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}

export default App;