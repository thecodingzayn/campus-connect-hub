import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  BookOpen, 
  Bell, 
  ArrowUpRight,
  ChevronRight,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const StudentDashboard = () => {
  const [grades, setGrades] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Get current user id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch grades
      const { data: gradesData } = await supabase
        .from('grades')
        .select('*')
        .eq('student_id', user.id);
      
      if (gradesData) setGrades(gradesData);

      // Fetch announcements
      const { data: annData } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (annData) setAnnouncements(annData.map(a => ({
        title: a.title,
        date: new Date(a.created_at).toLocaleDateString(),
        type: a.type
      })));
    };

    fetchData();

    // Real-time grades
    const gradesChannel = supabase
      .channel('student-grades')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'grades' },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const newGrade = payload.new;
            setGrades(prev => {
              const exists = prev.find(g => g.id === newGrade.id || g.subject === newGrade.subject);
              if (exists) {
                return prev.map(g => (g.id === newGrade.id || g.subject === newGrade.subject) ? newGrade : g);
              }
              return [newGrade, ...prev];
            });
            toast.success(`New grade posted for ${newGrade.subject}!`);
          }
        }
      )
      .subscribe();

    // Real-time announcements
    const annChannel = supabase
      .channel('student-announcements')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'announcements' },
        (payload) => {
          const newAnn = payload.new;
          setAnnouncements(prev => [
            { title: newAnn.title, date: 'Just now', type: newAnn.type || 'News' },
            ...prev
          ]);
          toast.info(`New Announcement: ${newAnn.title}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(gradesChannel);
      supabase.removeChannel(annChannel);
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Student Portal</h1>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
            <Zap size={12} className="fill-green-700" /> Live Updates
          </Badge>
        </div>
        <p className="text-slate-500">Welcome back! You have the latest updates here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-none shadow-sm bg-blue-600 text-white overflow-hidden relative">
          <CardContent className="p-8 flex flex-col justify-between h-full min-h-[240px]">
            <div className="relative z-10">
              <Badge className="bg-blue-500/50 text-white border-none mb-4">Ongoing Class</Badge>
              <h2 className="text-3xl font-bold mb-2">Introduction to Quantum Physics</h2>
              <p className="text-blue-100 flex items-center gap-2">
                <Clock size={16} /> 10:15 AM - 11:30 AM • Room 402
              </p>
            </div>
            <div className="relative z-10 mt-8 flex gap-4">
              <Button className="bg-white text-blue-600 hover:bg-blue-50">Join Online</Button>
              <Button variant="ghost" className="text-white hover:bg-blue-500">View Materials</Button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Upcoming Assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <BookOpen size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 text-sm">Calculus Problem Set</h4>
                <p className="text-xs text-slate-500">Due Tomorrow, 11:59 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <GraduationCap size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 text-sm">Literature Essay</h4>
                <p className="text-xs text-slate-500">Due in 3 days</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">View Calendar</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Academic Performance</CardTitle>
            <ArrowUpRight size={18} className="text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {grades.length > 0 ? grades.map((grade) => (
                  <motion.div 
                    key={grade.id || grade.subject}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="font-medium text-slate-700">{grade.subject}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-slate-900">{grade.score}</span>
                      <Badge variant="outline" className={cn(
                        "text-[10px]",
                        grade.trend === 'up' ? "text-green-600" : grade.trend === 'down' ? "text-red-600" : "text-slate-500"
                      )}>
                        {grade.trend?.toUpperCase()}
                      </Badge>
                    </div>
                  </motion.div>
                )) : (
                  <p className="text-slate-500 text-sm text-center py-4">No grades posted yet.</p>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Announcements</CardTitle>
            <Bell size={18} className="text-slate-400" />
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence mode="popLayout">
              {announcements.length > 0 ? announcements.map((ann, idx) => (
                <motion.div 
                  key={idx} 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-[10px] h-5">{ann.type}</Badge>
                      <span className="text-xs text-slate-400">{ann.date}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{ann.title}</h4>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                </motion.div>
              )) : (
                <p className="text-slate-500 text-sm text-center py-4">No announcements yet.</p>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;