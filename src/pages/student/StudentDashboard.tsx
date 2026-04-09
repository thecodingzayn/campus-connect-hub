import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  BookOpen, 
  Bell, 
  ArrowUpRight,
  ChevronRight,
  Zap,
  Star,
  Trophy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const StudentDashboard = () => {
  const [grades, setGrades] = useState([
    { subject: 'Mathematics', score: 'A-', trend: 'up' },
    { subject: 'Physics', score: 'B+', trend: 'down' },
    { subject: 'Literature', score: 'A', trend: 'stable' },
  ]);

  const [announcements, setAnnouncements] = useState([
    { title: 'Final Exams Schedule Published', date: '2 hours ago', type: 'Exams' },
    { title: 'School Football Match: Tigers vs Lions', date: '3 hours ago', type: 'Events' },
  ]);

  const [isLiveSession, setIsLiveSession] = useState(true);

  useEffect(() => {
    // Real-time grades
    const gradesChannel = supabase
      .channel('student-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'grades' },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const newGrade = payload.new;
            setGrades(prev => {
              const exists = prev.find(g => g.subject === newGrade.subject);
              if (exists) {
                return prev.map(g => g.subject === newGrade.subject ? { ...g, score: newGrade.score, trend: newGrade.trend } : g);
              }
              return [{ subject: newGrade.subject, score: newGrade.score, trend: newGrade.trend }, ...prev];
            });
            toast.success(`New grade posted for ${newGrade.subject}!`, {
              icon: <Trophy className="w-4 h-4 text-yellow-500" />
            });
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'announcements' },
        (payload) => {
          const newAnn = payload.new;
          setAnnouncements(prev => [
            { title: newAnn.title, date: 'Just now', type: newAnn.type || 'News' },
            ...prev.slice(0, 4)
          ]);
          toast.info(`Announcement: ${newAnn.title}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(gradesChannel);
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Student Portal</h1>
          <div className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
            Active Sync
          </div>
        </div>
        <p className="text-slate-500 font-medium">Welcome back, Marcus! Here's your school life today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-none shadow-sm bg-blue-600 text-white overflow-hidden relative">
          <CardContent className="p-8 flex flex-col justify-between h-full min-h-[260px]">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-blue-500/50 text-white border-none">Ongoing Session</Badge>
                {isLiveSession && <span className="flex items-center gap-1.5 text-blue-200 text-xs font-bold">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span> LIVE
                </span>}
              </div>
              <motion.h2 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-black mb-2 tracking-tight"
              >
                Quantum Physics 101
              </motion.h2>
              <p className="text-blue-100 flex items-center gap-2 font-medium">
                <Clock size={18} /> 10:15 AM - 11:30 AM \\u2022 Dr. Sarah Hudson \\u2022 Lab 4
              </p>
            </div>
            <div className="relative z-10 mt-10 flex gap-4">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 font-bold">Join Online Class</Button>
              <Button variant="ghost" className="text-white hover:bg-blue-500/50">View Coursework</Button>
            </div>
            {/* Abstract Background Decoration */}
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="absolute top-1/2 right-1/4 w-1 h-24 bg-gradient-to-b from-white/0 via-white/20 to-white/0 rotate-45"></div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-md font-bold">Deadlines</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {[ 
                { title: 'Calculus Quiz', due: 'Tomorrow, 11:59 PM', color: 'orange', icon: BookOpen },
                { title: 'History Essay', due: 'Oct 28th', color: 'purple', icon: GraduationCap },
                { title: 'Lab Report #4', due: 'Oct 30th', color: 'blue', icon: Star }
              ].map((item, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ backgroundColor: '#f8fafc' }}
                  className="flex items-start gap-4 p-4 cursor-pointer group transition-colors"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                    item.color === 'orange' ? "bg-orange-100 text-orange-600" : 
                    item.color === 'purple' ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                  )}>
                    <item.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Due {item.due}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="p-4">
              <Button variant="ghost" className="w-full text-slate-500 hover:text-slate-900 text-xs font-bold">
                View All Calendar Events <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="border-none shadow-sm lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Performance</CardTitle>
            <ArrowUpRight size={18} className="text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <AnimatePresence mode="popLayout">
                {grades.map((grade) => (
                  <motion.div 
                    key={grade.subject}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:border-blue-100 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse"></div>
                      <span className="font-bold text-slate-700">{grade.subject}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-black text-slate-900">{grade.score}</span>
                      <Badge className={cn(
                        "text-[10px] font-black",
                        grade.trend === 'up' ? "bg-green-50 text-green-700" : grade.trend === 'down' ? "bg-red-50 text-red-700" : "bg-slate-50 text-slate-500"
                      )}>
                        {grade.trend.toUpperCase()}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold">School Activity Feed</CardTitle>
              <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none px-2 h-5 text-[10px] font-bold tracking-wider">LIVE</Badge>
            </div>
            <Bell size={18} className="text-slate-400" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {announcements.map((ann, idx) => (
                  <motion.div 
                    key={idx} 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between group cursor-pointer hover:bg-slate-50/80 p-5 transition-all"
                  >
                    <div className="flex gap-4">
                      <div className={cn(
                        "w-1 h-12 rounded-full",
                        ann.type === 'Exams' ? "bg-red-500" : ann.type === 'Events' ? "bg-orange-500" : "bg-blue-500"
                      )}></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge variant="outline" className="text-[10px] font-bold h-5 px-2 tracking-wide border-slate-200">{ann.type.toUpperCase()}</Badge>
                          <span className="text-[10px] font-bold text-slate-400">{ann.date.toUpperCase()}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{ann.title}</h4>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <ChevronRight size={16} className="text-slate-600" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;