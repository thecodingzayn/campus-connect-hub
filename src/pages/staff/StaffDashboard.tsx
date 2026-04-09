import React from 'react';
import { 
  ClipboardList, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IMAGES } from '@/lib/constants';

const StaffDashboard = () => {
  const schedule = [
    { time: '08:30 AM', subject: 'Mathematics', class: 'Grade 10-A', room: 'Room 204' },
    { time: '10:15 AM', subject: 'Calculus', class: 'Grade 12-B', room: 'Lab 1' },
    { time: '01:00 PM', subject: 'Algebra', class: 'Grade 9-C', room: 'Room 105' },
  ];

  const students = [
    { name: 'Alice Cooper', id: 'S1024', attendance: 'Present', avatar: IMAGES.STUDENT },
    { name: 'Bob Marley', id: 'S1025', attendance: 'Absent', avatar: IMAGES.STUDENT },
    { name: 'Charlie Brown', id: 'S1026', attendance: 'Present', avatar: IMAGES.STUDENT },
    { name: 'Diana Prince', id: 'S1027', attendance: 'Late', avatar: IMAGES.STUDENT },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Staff Portal</h1>
          <p className="text-slate-500">Monday, October 24th, 2023</p>
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
                <div key={idx} className="flex items-center gap-6 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col items-center justify-center min-w-[80px] text-center border-r border-slate-100 pr-6">
                    <span className="text-sm font-bold text-slate-900">{item.time}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">{item.subject}</h4>
                    <p className="text-sm text-slate-500">{item.class} • {item.room}</p>
                  </div>
                  <Button variant="outline" size="sm">View Class</Button>
                </div>
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
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>{student.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.id}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 bg-green-50">
                      <CheckCircle2 size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 bg-red-50">
                      <XCircle size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                      <MoreVertical size={16} />
                    </Button>
                  </div>
                </div>
              ))}
              <Button className="w-full mt-4 bg-slate-900">Submit Attendance</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;