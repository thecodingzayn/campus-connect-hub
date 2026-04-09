import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Zap,
  BookOpen,
  MessageSquare,
  Plus,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IMAGES } from '@/lib/constants';
import { supabase, createGrade, createAttendance, updateAttendance } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const StaffDashboard = () => {
  const [schedule, setSchedule] = useState([
    { time: '08:30 AM', subject: 'Mathematics', class: 'Grade 10-A', room: 'Room 204', status: 'completed' },
    { time: '10:15 AM', subject: 'Calculus', class: 'Grade 12-B', room: 'Lab 1', status: 'ongoing' },
    { time: '01:00 PM', subject: 'Algebra', class: 'Grade 9-C', room: 'Room 105', status: 'upcoming' },
  ]);

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [newGrade, setNewGrade] = useState({ student_id: '', subject: 'Calculus', score: '', trend: 'stable' });

  const fetchData = async () => {
    setLoading(true);
    // Fetch students (profiles with role='student')
    const { data: studentsData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student')
      .limit(10);

    if (error) {
      toast.error('Failed to fetch students');
    } else {
      // Get attendance status for today
      const today = new Date().toISOString().split('T')[0];
      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('*')
        .eq('date', today);

      const combined = (studentsData || []).map(s => {
        const att = attendanceData?.find(a => a.student_id === s.id);
        return {
          ...s,
          attendance: att ? att.status : 'pending'
        };
      });
      setStudents(combined);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // Subscribe to attendance updates
    const attendanceChannel = supabase
      .channel('staff-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance' },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const update = payload.new;
            setStudents(prev => prev.map(s => 
              s.id === update.student_id ? { ...s, attendance: update.status } : s
            ));
            
            toast.info(`Attendance update detected for student ${update.student_id}`, {
              icon: <CheckCircle2 className="w-4 h-4 text-blue-500 animate-pulse" />
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(attendanceChannel);
    };
  }, []);

  const handleAttendance = async (studentId: string, status: 'present' | 'absent' | 'late') => {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if record exists
    const { data: existing } = await supabase
      .from('attendance')
      .select('id')
      .eq('student_id', studentId)
      .eq('date', today)
      .single();

    let error;
    if (existing) {
      const { error: err } = await updateAttendance(existing.id, { status });
      error = err;
    } else {
      const { error: err } = await createAttendance({
        student_id: studentId,
        status,
        date: today
      });
      error = err;
    }

    if (error) {
      toast.error('Failed to record attendance');
    } else {
      toast.success(`Attendance marked as ${status}`);
    }
  };

  const handleAddGrade = async () => {
    if (!newGrade.student_id || !newGrade.score) return;

    const { error } = await createGrade(newGrade);

    if (error) {
      toast.error('Failed to save grade');
    } else {
      toast.success('Grade recorded successfully!');
      setIsGradeModalOpen(false);
      setNewGrade({ student_id: '', subject: 'Calculus', score: '', trend: 'stable' });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Staff Portal</h1>
            <div className="flex items-center gap-1 bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <div className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-ping"></div>
              Live Sync
            </div>
          </div>
          <p className="text-slate-500">Active Session: Grade 12-B Calculus</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isGradeModalOpen} onOpenChange={setIsGradeModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                <Plus size={18} className="mr-2" /> Add Grade
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enter Student Grade</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Student</label>
                  <Select 
                    value={newGrade.student_id} 
                    onValueChange={(v) => setNewGrade({...newGrade, student_id: v})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input 
                    value={newGrade.subject}
                    onChange={(e) => setNewGrade({...newGrade, subject: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Score (e.g. 95/100)</label>
                    <Input 
                      placeholder="95%"
                      value={newGrade.score}
                      onChange={(e) => setNewGrade({...newGrade, score: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Trend</label>
                    <Select 
                      value={newGrade.trend} 
                      onValueChange={(v: any) => setNewGrade({...newGrade, trend: v})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="up">Improving</SelectItem>
                        <SelectItem value="stable">Stable</SelectItem>
                        <SelectItem value="down">Declining</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsGradeModalOpen(false)}>Cancel</Button>
                <Button onClick={handleAddGrade}>Save Grade</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
                <Calendar size={18} className="text-blue-600" /> Class Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {schedule.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ x: 4 }}
                  className={cn(
                    "flex items-center gap-6 p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden",
                    item.status === 'ongoing' ? "border-blue-200 bg-blue-50/30" : "border-slate-100 bg-white hover:bg-slate-50"
                  )}
                >
                  {item.status === 'ongoing' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                  )}
                  <div className="flex flex-col items-center justify-center min-w-[80px] text-center border-r border-slate-100 pr-6">
                    <span className="text-sm font-bold text-slate-900">{item.time}</span>
                    {item.status === 'ongoing' && <Badge className="mt-1 text-[8px] h-4 bg-blue-600">LIVE</Badge>}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">{item.subject}</h4>
                    <p className="text-sm text-slate-500">{item.class} \\\\u2022 {item.room}</p>
                  </div>
                  <div className="hidden sm:block">
                    <Button variant={item.status === 'completed' ? "ghost" : "outline"} size="sm" className="h-8">
                      {item.status === 'completed' ? 'Review' : item.status === 'ongoing' ? 'View Live' : 'Prepare'}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-bold flex items-center gap-2">
                  <BookOpen size={16} className="text-purple-600" /> Class Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6 bg-slate-50/50 rounded-b-xl">
                <p className="text-xs text-slate-500">Use the tools above to manage grades and student progress for your current semester.</p>
                <div className="flex justify-center py-4 text-slate-300">
                  <Zap size={48} className="animate-pulse" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-blue-600 text-white overflow-hidden relative">
              <CardContent className="p-6 h-full flex flex-col justify-between">
                <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-1">Staff Chat</h3>
                  <p className="text-blue-100 text-xs">Coordinate with other department faculty.</p>
                </div>
                <div className="relative z-10 mt-8">
                  <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">Open Chat</Button>
                </div>
                <Users className="absolute -bottom-6 -right-6 text-white/10 w-32 h-32" />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Class Attendance</CardTitle>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-slate-500">Current: {new Date().toLocaleDateString()}</p>
                <Badge variant="secondary" className="bg-green-50 text-green-700 h-5 text-[10px]">Live Sync Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="p-8 text-center text-slate-500 text-sm">Syncing student list...</div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {students.map((student) => (
                    <motion.div 
                      key={student.id} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 ring-2 ring-slate-100">
                          <AvatarImage src={student.avatar_url} />
                          <AvatarFallback>{student.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{student.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-tight">{student.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleAttendance(student.id, 'present')}
                          className={cn(
                            "h-8 w-8 transition-all rounded-full",
                            student.attendance === 'present' ? "text-white bg-green-500 scale-110 shadow-sm" : "text-slate-400 bg-slate-100 hover:bg-green-50 hover:text-green-500"
                          )}
                        >
                          <CheckCircle2 size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleAttendance(student.id, 'absent')}
                          className={cn(
                            "h-8 w-8 transition-all rounded-full",
                            student.attendance === 'absent' ? "text-white bg-red-500 scale-110 shadow-sm" : "text-slate-400 bg-slate-100 hover:bg-red-50 hover:text-red-500"
                          )}
                        >
                          <XCircle size={16} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              <Button className="w-full mt-4 bg-slate-900 h-10">Finalize Log</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;