import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { User, UserRole } from '@/types';
import { IMAGES, AUTH_MESSAGES } from '@/lib/constants';
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
    // This is called by Login component UI for immediate feedback
    setActiveTab('dashboard');
    toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
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
              <img 
                src={user.avatar || (user.role === 'staff' ? IMAGES.STAFF : user.role === 'student' ? IMAGES.STUDENT : IMAGES.PARENT)} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
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