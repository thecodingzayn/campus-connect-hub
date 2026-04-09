import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  BookOpen, 
  Plus, 
  MoreHorizontal,
  Search,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IMAGES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { label: 'Total Students', value: '1,284', change: '+12%', icon: Users, color: 'blue' },
    { label: 'Staff Members', value: '94', change: '+2%', icon: UserCheck, color: 'purple' },
    { label: 'Total Classes', value: '42', change: '0%', icon: BookOpen, color: 'green' },
    { label: 'Avg Attendance', value: '96.2%', change: '+0.5%', icon: TrendingUp, color: 'pink' },
  ]);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) {
        console.error('Error fetching users:', error);
      } else if (data) {
        setRecentUsers(data.map(p => ({
          name: p.name || 'Unknown',
          role: p.role,
          email: p.email,
          status: 'Active',
          avatar: p.avatar_url || (p.role === 'staff' ? IMAGES.STAFF : IMAGES.STUDENT)
        })));
      }
    };

    fetchData();

    // Subscribe to profiles for real-time user updates
    const profilesChannel = supabase
      .channel('admin-profiles')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'profiles' },
        (payload) => {
          const newUser = payload.new;
          setRecentUsers(prev => [{
            name: newUser.name || 'New User',
            role: newUser.role || 'student',
            email: newUser.email || 'pending@school.com',
            status: 'Active',
            avatar: newUser.avatar_url || (newUser.role === 'staff' ? IMAGES.STAFF : IMAGES.STUDENT)
          }, ...prev.slice(0, 3)]);
          toast.success(`New ${newUser.role} registered: ${newUser.name}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannel);
    };
  }, []);

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Overview</h1>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
            <Zap size={12} className="fill-blue-700" /> Live
          </Badge>
        </div>
        <p className="text-slate-500">Welcome back! Here's what's happening in your school today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-2 rounded-lg bg-slate-100")}>
                    <stat.icon size={20} className={cn(
                      stat.color === 'blue' ? "text-blue-600" : 
                      stat.color === 'purple' ? "text-purple-600" : 
                      stat.color === 'green' ? "text-green-600" : "text-pink-600"
                    )} />
                  </div>
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-none">
                    {stat.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Registrations</CardTitle>
            <CardDescription>A list of recently added users in the system.</CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input placeholder="Filter users..." className="pl-10 h-9" />
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus size={16} className="mr-1" /> Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence initial={false}>
                {recentUsers.map((user, index) => (
                  <motion.tr 
                    key={user.email || index}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="border-b last:border-none"
                  >
                    <TableCell className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{user.name}</span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn(
                        "font-medium",
                        user.status === 'Active' ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                      )}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;