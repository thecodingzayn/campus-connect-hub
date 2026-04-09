import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MoreVertical,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { IMAGES } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const StaffDashboard = () => {
  const [schedule] = useState([
    { time: '08:30 AM', subject: 'Mathematics', class: 'Grade 10-A', room: 'Room 204' },
    { time: '10:15 AM', subject: 'Calculus', class: 'Grade 12-B', room: 'Lab 1' },
    { time: '01:00 PM', subject: 'Algebra', class: 'Grade 9-C', room: 'Room 105' },
  ]);

  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch student profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student');

      // Fetch today's attendance
      const { data: attendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('date', new Date().toISOString().split('T')[0]);

      if (profiles) {
        setStudents(profiles.map(p => {
          const att = attendance?.find(a => a.student_id === p.id);
          return {
            id: p.id,
            name: p.name || 'Student',
            attendance: att?.status || 'pending',
            avatar: p.avatar_url || IMAGES.STUDENT
          };
        }));
      }
    };

    fetchData();

    // Subscribe to attendance updates
    const attendanceChannel = supabase
      .channel('staff-attendance')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance' },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const update = payload.new;
            setStudents(prev => prev.map(s => 
              s.id === update.student_id ? { ...s, attendance: update.status } : s
            ));
            
            if (payload.eventType === 'UPDATE') {
              toast.info(`Attendance updated for student: ${update.student_id}`);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(attendanceChannel);
    };
  }, []);

  const handleAttendance = async (studentId: string, status: 'present' | 'absent' | 'late') => {
    try {
      const { error } = await supabase
        .from('attendance')
        .upsert({
          student_id: studentId,
          status,
          date: new Date().toISOString().split('T')[0]
        }, { onConflict: 'student_id,date' });

      if (error) throw error;
      
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, attendance: status } : s));
      toast.success(`Attendance marked as ${status}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update attendance');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Staff Portal</h1>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 gap-1">
              <Zap size={12} className="fill-orange-700" /> Live Updates
            </Badge>
          </div>
          <p className="text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <ClipboardList size={18} className="mr-2" /> Take Attendance
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" /> Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {schedule.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center gap-6 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center min-w-[80px] text-center border-r border-slate-100 pr-6">
                    <span className="text-sm font-bold text-slate-900">{item.time}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">{item.subject}</h4>
                    <p className="text-sm text-slate-500">{item.class} • {item.room}</p>
                  </div>
                  <Button variant="outline" size="sm">View Class</Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">Pending Grading</CardTitle>
              <Button variant="ghost" className="text-blue-600">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <h4 className="font-bold text-blue-900">Midterm Algebra Quiz</h4>
                  <p className="text-sm text-blue-700">24/32 Submitted • Due Today</p>
                  <div className="mt-4 w-full bg-blue-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-3/4"></div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                  <h4 className="font-bold text-orange-900">Calculus Homework</h4>
                  <p className="text-sm text-orange-700">12/30 Submitted • Due in 2 days</p>
                  <div className="mt-4 w-full bg-orange-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-orange-600 h-full w-2/5"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Class Attendance</CardTitle>
              <p className="text-sm text-slate-500">Current: Grade 10-A</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <AnimatePresence mode="popLayout">
                {students.map((student) => (
                  <motion.div 
                    key={student.id} 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{student.name}</p>
                        <p className="text-[10px] text-slate-500">{student.id.slice(0, 8)}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleAttendance(student.id, 'present')}
                        className={cn(
                          "h-8 w-8 transition-colors",
                          student.attendance === 'present' ? "text-white bg-green-600" : "text-green-600 bg-green-50"
                        )}
                      >
                        <CheckCircle2 size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleAttendance(student.id, 'absent')}
                        className={cn(
                          "h-8 w-8 transition-colors",
                          student.attendance === 'absent' ? "text-white bg-red-600" : "text-red-600 bg-red-50"
                        )}
                      >
                        <XCircle size={16} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button className="w-full mt-4 bg-slate-900">Submit Attendance</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;