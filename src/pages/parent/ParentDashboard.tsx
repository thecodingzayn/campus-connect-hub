import React from 'react';
import { 
  Heart, 
  Calendar, 
  ClipboardCheck, 
  DollarSign, 
  MessageSquare,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IMAGES } from '@/lib/constants';

const ParentDashboard = () => {
  const children = [
    { name: 'Marcus Chen', grade: 'Grade 12', status: 'In School', avatar: IMAGES.STUDENT },
    { name: 'Lily Chen', grade: 'Grade 8', status: 'In School', avatar: IMAGES.STUDENT },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Parent Portal</h1>
        <p className="text-slate-500">Manage and track your children's educational journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Your Children</h2>
          {children.map((child, idx) => (
            <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer">
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
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-xs font-medium text-green-700">{child.status}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile <ChevronRight size={14} className="ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

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
              <div className="p-6 border-b border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <TrendingUp size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-900">Academic Report Published</h4>
                    <span className="text-xs text-slate-400">1h ago</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">Marcus's Mid-term report is now available for review.</p>
                  <Button variant="secondary" size="sm" className="h-8">Download PDF</Button>
                </div>
              </div>
              
              <div className="p-6 border-b border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Calendar size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-900">Parent-Teacher Meeting</h4>
                    <span className="text-xs text-slate-400">Yesterday</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">Scheduled for Oct 30th with Mr. Roberts (Math).</p>
                  <Button variant="secondary" size="sm" className="h-8">Add to Calendar</Button>
                </div>
              </div>

              <div className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                  <MessageSquare size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-900">Message from Principal</h4>
                    <span className="text-xs text-slate-400">2 days ago</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">Regarding upcoming school renovation project.</p>
                  <Button variant="secondary" size="sm" className="h-8">Reply</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;