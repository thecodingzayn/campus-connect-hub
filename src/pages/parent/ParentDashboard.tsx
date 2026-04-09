import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Calendar, 
  ClipboardCheck, 
  DollarSign, 
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Zap
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
  const [children, setChildren] = useState<any[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // In a real app, we'd have a children/parents junction table
      // For now, let's fetch students as a placeholder or assume student metadata
      const { data: childrenData } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .limit(2); // Simplified child fetching for demo

      if (childrenData) {
        // Fetch current attendance for these children
        const childIds = childrenData.map(c => c.id);
        const { data: attendance } = await supabase
          .from('attendance')
          .select('*')
          .in('student_id', childIds)
          .eq('date', new Date().toISOString().split('T')[0]);

        setChildren(childrenData.map(c => {
          const att = attendance?.find(a => a.student_id === c.id);
          return {
            id: c.id,
            name: c.name || 'Child',
            grade: 'Grade 12', // Placeholder
            status: att?.status === 'present' ? 'In School' : 'Away',
            avatar: c.avatar_url || IMAGES.STUDENT
          };
        }));
      }

      // Fetch recent notifications for this parent
      const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (notifications) {
        setRecentUpdates(notifications.map(n => ({
          id: n.id,
          title: n.title,
          date: new Date(n.created_at).toLocaleDateString(),
          message: n.message,
          type: n.type,
          icon: n.type === 'report' ? TrendingUp : n.type === 'event' ? Calendar : MessageSquare,
          color: n.type === 'report' ? 'blue' : n.type === 'event' ? 'purple' : 'pink'
        })));
      }
    };

    fetchData();

    // Subscribe to attendance for children status updates
    const statusChannel = supabase
      .channel('parent-children-status')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance' },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const update = payload.new;
            setChildren(prev => prev.map(c => 
              c.id === update.student_id ? { ...c, status: update.status === 'present' ? 'In School' : 'Away' } : c
            ));
          }
        }
      )
      .subscribe();

    // Subscribe to notifications/updates
    const updatesChannel = supabase
      .channel('parent-updates')
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
              type: newUpdate.type, 
              icon: MessageSquare, 
              color: 'pink' 
            },
            ...prev
          ]);
          toast.success(`New update for your children: ${newUpdate.title}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(statusChannel);
      supabase.removeChannel(updatesChannel);
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Parent Portal</h1>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 gap-1">
            <Zap size={12} className="fill-purple-700" /> Real-time Monitoring
          </Badge>
        </div>
        <p className="text-slate-500">Manage and track your children's educational journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Your Children</h2>
          <AnimatePresence mode="popLayout">
            {children.length > 0 ? children.map((child, idx) => (
              <motion.div
                key={child.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 ring-4 ring-blue-50">
                          <AvatarImage src={child.avatar} />
                          <AvatarFallback>{child.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{child.name}</h3>
                          <p className="text-sm text-slate-500">{child.grade}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              child.status === 'In School' ? "bg-green-500" : "bg-slate-300"
                            )}></div>
                            <span className={cn(
                              "text-xs font-medium",
                              child.status === 'In School' ? "text-green-700" : "text-slate-500"
                            )}>{child.status}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Profile <ChevronRight size={14} className="ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )) : (
              <p className="text-slate-500 text-sm py-4 text-center">No children linked to this account.</p>
            )}
          </AnimatePresence>

          <Card className="border-none shadow-sm bg-slate-900 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <DollarSign size={20} className="text-green-400" /> Fee Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Outstanding Balance</p>
                  <h2 className="text-3xl font-bold">$1,240.00</h2>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Pay Now</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Recent Updates</h2>
          <Card className="border-none shadow-sm">
            <CardContent className="p-0">
              <AnimatePresence mode="popLayout">
                {recentUpdates.length > 0 ? recentUpdates.map((update) => (
                  <motion.div 
                    key={update.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 border-b border-slate-100 flex items-start gap-4 last:border-none"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      update.color === 'blue' ? "bg-blue-100 text-blue-600" : 
                      update.color === 'purple' ? "bg-purple-100 text-purple-600" : "bg-pink-100 text-pink-600"
                    )}>
                      {React.createElement(update.icon || MessageSquare, { size: 20 })}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-900">{update.title}</h4>
                        <span className="text-xs text-slate-400">{update.date}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{update.message}</p>
                      <Button variant="secondary" size="sm" className="h-8">
                        {update.type === 'report' ? 'Download PDF' : update.type === 'event' ? 'Add to Calendar' : 'Reply'}
                      </Button>
                    </div>
                  </motion.div>
                )) : (
                  <p className="text-slate-500 text-sm p-8 text-center">No recent updates.</p>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;