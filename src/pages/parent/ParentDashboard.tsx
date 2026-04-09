import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Calendar, 
  ClipboardCheck, 
  DollarSign, 
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { IMAGES } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const ParentDashboard = () => {
  const [children, setChildren] = useState([
    { id: 'S123', name: 'Marcus Chen', grade: 'Grade 12', status: 'In School', avatar: IMAGES.STUDENT, mood: 'Focused' },
    { id: 'S456', name: 'Lily Chen', grade: 'Grade 8', status: 'In School', avatar: IMAGES.STUDENT, mood: 'Happy' },
  ]);

  const [recentUpdates, setRecentUpdates] = useState([
    { id: 1, title: 'Academic Report Published', date: '1h ago', message: "Marcus's Mid-term report is now available for download.", type: 'report', icon: TrendingUp, color: 'blue' },
    { id: 2, title: 'Parent-Teacher Meeting', date: 'Yesterday', message: "Scheduled for Oct 30th with Mr. Roberts regarding college prep.", type: 'event', icon: Calendar, color: 'purple' },
  ]);

  const [balance, setBalance] = useState(1240.00);

  useEffect(() => {
    // Subscribe to attendance for children status updates
    const statusChannel = supabase
      .channel('parent-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance' },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const update = payload.new;
            setChildren(prev => prev.map(c => 
              c.id === update.student_id ? { ...c, status: update.status === 'present' ? 'In School' : 'Away' } : c
            ));
            
            if (update.status === 'present') {
              toast.success(`Check-in: Your child has arrived at school.`, {
                icon: <ShieldCheck className="w-4 h-4 text-green-500" />
              });
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'payments' },
        (payload) => {
          const payment = payload.new;
          setBalance(prev => Math.max(0, prev - payment.amount));
          toast.success(`Payment Confirmed: $${payment.amount} credited to your account.`, {
            icon: <CreditCard className="w-4 h-4 text-green-500" />
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          const newUpdate = payload.new;
          setRecentUpdates(prev => [
            { 
              id: newUpdate.id, 
              title: newUpdate.title, 
              date: 'Just now', 
              message: newUpdate.message, 
              type: 'info', 
              icon: MessageSquare, 
              color: 'pink' 
            },
            ...prev
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(statusChannel);
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Parent Portal</h1>
          <div className="flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-pulse"></div>
            Live Monitoring Enabled
          </div>
        </div>
        <p className="text-slate-500 font-medium">Oversee your children's daily educational experience in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Your Children</h2>
            <Badge variant="outline" className="border-slate-200 bg-white shadow-sm">{children.length} Enrolled</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {children.map((child) => (
                <motion.div
                  key={child.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Avatar className="h-16 w-16 ring-4 ring-slate-50">
                              <AvatarImage src={child.avatar} />
                              <AvatarFallback>{child.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className={cn(
                              "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white",
                              child.status === 'In School' ? "bg-green-500" : "bg-slate-300"
                            )}></div>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{child.name}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{child.grade} \\u2022 ID: {child.id}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                          <p className={cn(
                            "text-sm font-black",
                            child.status === 'In School' ? "text-green-600" : "text-slate-500"
                          )}>{child.status.toUpperCase()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mood Indicator</p>
                          <div className="flex items-center gap-1.5">
                            <Heart size={12} className="text-pink-500 fill-pink-500" />
                            <p className="text-sm font-black text-slate-900">{child.mood}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Button className="w-full mt-6 bg-slate-900 hover:bg-slate-800 h-10">
                        Full Analytics <ArrowUpRight size={14} className="ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Card className="border-none shadow-lg bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <DollarSign size={20} className="text-green-400 animate-pulse" /> Tuition & Fees
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Outstanding institution balance</p>
                  <motion.h2 
                    key={balance}
                    initial={{ scale: 1.1, color: '#4ade80' }}
                    animate={{ scale: 1, color: '#ffffff' }}
                    className="text-5xl font-black tracking-tighter"
                  >
                    ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </motion.h2>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-slate-700 bg-transparent text-white hover:bg-slate-800">
                    Statement PDF
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-500 px-8 font-bold">
                    Pay Online Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Live Activity Stream</h2>
          <Card className="border-none shadow-sm">
            <CardContent className="p-0">
              <AnimatePresence mode="popLayout">
                {recentUpdates.length > 0 ? (
                  recentUpdates.map((update) => (
                    <motion.div 
                      key={update.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-6 border-b border-slate-50 flex items-start gap-4 last:border-none group hover:bg-slate-50/50 transition-colors cursor-pointer"
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110",
                        update.color === 'blue' ? "bg-blue-100 text-blue-600" : 
                        update.color === 'purple' ? "bg-purple-100 text-purple-600" : "bg-pink-100 text-pink-600"
                      )}>
                        <update.icon size={22} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1.5">
                          <h4 className="font-bold text-slate-900 text-sm">{update.title}</h4>
                          <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{update.date}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">{update.message}</p>
                        <div className="flex gap-2">
                          <Button size="sm" className="h-8 text-[11px] font-bold px-4">
                            {update.type === 'report' ? 'View Report' : update.type === 'event' ? 'Schedule' : 'View Details'}
                          </Button>
                          {update.type === 'report' && (
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ChevronRight size={14} />
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">No live updates right now.</p>
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="text-indigo-200" size={24} />
                <h3 className="font-bold">Safe Campus Protocol</h3>
              </div>
              <p className="text-xs text-indigo-100 leading-relaxed">
                Real-time tracking of school gates and classroom attendance is active. Your child's safety is our priority.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;