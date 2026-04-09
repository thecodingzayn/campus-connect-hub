import React from 'react';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  BookOpen, 
  Plus, 
  MoreHorizontal,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IMAGES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Students', value: '1,284', change: '+12%', icon: Users, color: 'blue' },
    { label: 'Staff Members', value: '94', change: '+2%', icon: UserCheck, color: 'purple' },
    { label: 'Total Classes', value: '42', change: '0%', icon: BookOpen, color: 'green' },
    { label: 'Avg Attendance', value: '96.2%', change: '+0.5%', icon: TrendingUp, color: 'pink' },
  ];

  const recentUsers = [
    { name: 'Sarah Wilson', role: 'Staff', email: 's.wilson@school.com', status: 'Active', avatar: IMAGES.STAFF },
    { name: 'Marcus Chen', role: 'Student', email: 'm.chen@school.com', status: 'Pending', avatar: IMAGES.STUDENT },
    { name: 'Elena Rodriguez', role: 'Parent', email: 'e.rod@gmail.com', status: 'Active', avatar: IMAGES.PARENT },
    { name: 'David Smith', role: 'Staff', email: 'd.smith@school.com', status: 'Active', avatar: IMAGES.STAFF },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Overview</h1>
        <p className="text-slate-500">Welcome back! Here's what's happening in your school today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-lg bg-slate-100")}>
                  <stat.icon size={20} className={`text-${stat.color}-600`} />
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
              {recentUsers.map((user) => (
                <TableRow key={user.email}>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;