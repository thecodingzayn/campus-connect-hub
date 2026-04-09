import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  BookOpen, 
  Plus, 
  MoreHorizontal,
  Search,
  Zap,
  Activity,
  Trash2,
  Edit,
  Megaphone,
  School
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IMAGES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { 
  supabase, 
  createProfile, 
  deleteProfile, 
  createAnnouncement,
  createCourse,
  deleteCourse
} from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  
  // Form states
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'student' });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', type: 'News' });
  const [newCourse, setNewCourse] = useState({ name: '', code: '', description: '' });

  const [stats, setStats] = useState([
    { label: 'Total Students', value: 0, change: '+0', icon: Users, color: 'blue' },
    { label: 'Staff Members', value: 0, change: '+0', icon: UserCheck, color: 'purple' },
    { label: 'Total Courses', value: 0, change: '+0', icon: BookOpen, color: 'green' },
    { label: 'Avg Attendance', value: '96.2%', change: '+0.5%', icon: TrendingUp, color: 'pink' },
  ]);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch Profiles
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    
    // Fetch Courses
    const { data: coursesData } = await supabase.from('courses').select('*');

    setRecentUsers(profiles?.slice(0, 10) || []);
    setCourses(coursesData || []);
    
    // Update stats
    setStats(prev => prev.map(s => {
      if (s.label === 'Total Students') return { ...s, value: profiles?.filter(p => p.role === 'student').length || 0 };
      if (s.label === 'Staff Members') return { ...s, value: profiles?.filter(p => p.role === 'staff').length || 0 };
      if (s.label === 'Total Courses') return { ...s, value: coursesData?.length || 0 };
      return s;
    }));
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    const profilesChannel = supabase.channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, () => fetchData())
      .subscribe();

    return () => { supabase.removeChannel(profilesChannel); };
  }, []);

  const handleAddUser = async () => {
    const { error } = await createProfile({ id: crypto.randomUUID(), ...newUser, avatar_url: newUser.role === 'staff' ? IMAGES.STAFF : IMAGES.STUDENT });
    if (!error) { setIsAddUserOpen(false); setNewUser({ name: '', email: '', role: 'student' }); }
  };

  const handleAddCourse = async () => {
    const { error } = await createCourse(newCourse);
    if (!error) { setIsAddCourseOpen(false); setNewCourse({ name: '', code: '', description: '' }); toast.success('Course added'); }
  };

  const handleAddAnnouncement = async () => {
    const { error } = await createAnnouncement(newAnnouncement);
    if (!error) { setIsAddAnnouncementOpen(false); setNewAnnouncement({ title: '', content: '', type: 'News' }); toast.success('Announcement posted'); }
  };

  const handleDeleteUser = async (id: string) => { await deleteProfile(id); };
  const handleDeleteCourse = async (id: string) => { await deleteCourse(id); toast.success('Course deleted'); };

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Command Center</h1>
        <p className="text-slate-500">Manage students, staff, and curriculum from a single dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className="border-none shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className={cn("p-2 rounded-lg bg-slate-100")}><stat.icon size={20} /></div>
                  <Badge variant="secondary">{stat.change}</Badge>
                </div>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="courses">Curriculum</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Directory</CardTitle>
                <CardDescription>Manage your school's population.</CardDescription>
              </div>
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild><Button><Plus className="mr-2" size={16} /> Add User</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add New User</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input placeholder="Name" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                    <Input placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                    <Select value={newUser.role} onValueChange={v => setNewUser({...newUser, role: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter><Button onClick={handleAddUser}>Create</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Role</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {recentUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="flex items-center gap-3">
                        <Avatar className="h-8 w-8"><AvatarImage src={user.avatar_url} /><AvatarFallback>{user.name?.[0]}</AvatarFallback></Avatar>
                        <div><p className="font-medium">{user.name}</p><p className="text-xs text-slate-500">{user.email}</p></div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{user.role}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Course Catalog</CardTitle>
                <CardDescription>Define and manage subjects.</CardDescription>
              </div>
              <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
                <DialogTrigger asChild><Button><BookOpen className="mr-2" size={16} /> New Course</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Create Course</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input placeholder="Course Name" value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})} />
                    <Input placeholder="Course Code (e.g. MATH101)" value={newCourse.code} onChange={e => setNewCourse({...newCourse, code: e.target.value})} />
                    <Input placeholder="Description" value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} />
                  </div>
                  <DialogFooter><Button onClick={handleAddCourse}>Add Course</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Course</TableHead><TableHead>Code</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {courses.map(course => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.name}</TableCell>
                      <TableCell><Badge variant="secondary">{course.code}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCourse(course.id)} className="text-red-500"><Trash2 size={16} /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 text-white">
          <CardHeader><CardTitle className="flex items-center gap-2"><Megaphone className="text-blue-400" /> Announcements</CardTitle></CardHeader>
          <CardContent>
            <Dialog open={isAddAnnouncementOpen} onOpenChange={setIsAddAnnouncementOpen}>
              <DialogTrigger asChild><Button variant="outline" className="w-full border-slate-700 text-blue-400 hover:bg-slate-800">Post Global Update</Button></DialogTrigger>
              <DialogContent className="text-slate-900">
                <DialogHeader><DialogTitle>Global Broadcast</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                  <Input placeholder="Title" value={newAnnouncement.title} onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})} />
                  <Input placeholder="Message content" value={newAnnouncement.content} onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})} />
                </div>
                <DialogFooter><Button onClick={handleAddAnnouncement}>Broadcast Now</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-600 text-white flex items-center justify-between p-6">
          <div><h3 className="text-lg font-bold">Cloud Sync Status</h3><p className="text-blue-100 text-xs">Database is currently healthy and synced.</p></div>
          <Zap size={32} className="text-white/20" />
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;