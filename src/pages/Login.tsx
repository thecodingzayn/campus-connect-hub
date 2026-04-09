import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserRole } from '@/types';
import { IMAGES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, ShieldCheck, UserCog, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const roles = [
    { id: 'admin' as UserRole, label: 'Administrator', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: 'staff' as UserRole, label: 'Staff / Teachers', icon: UserCog, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'student' as UserRole, label: 'Student', icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-100' },
    { id: 'parent' as UserRole, label: 'Parent', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-100' },
  ];

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* Left side: Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white mb-12">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-blue-600" size={24} />
            </div>
            <span className="text-2xl font-bold">EduFlow</span>
          </div>
          
          <h1 className="text-5xl font-bold text-white leading-tight max-w-md">
            The complete management system for modern schools.
          </h1>
          <p className="mt-6 text-blue-100 text-lg max-w-md leading-relaxed">
            Empowering administrators, teachers, students, and parents with a unified platform for excellence in education.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-blue-100">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-blue-600 bg-slate-200 overflow-hidden">
                <img src={IMAGES.STUDENT} alt="User" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <p className="text-sm">Join over 2,500+ schools worldwide</p>
        </div>

        {/* Decorative background circles */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-700 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="border-none shadow-xl bg-white/70 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-8">
              <CardTitle className="text-2xl font-bold text-slate-900">Welcome back</CardTitle>
              <CardDescription>Select your portal and enter your credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium",
                      selectedRole === role.id 
                        ? "border-blue-600 bg-blue-50/50" 
                        : "border-slate-100 hover:border-slate-200 bg-slate-50"
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", role.bg, role.color)}>
                      <role.icon size={20} />
                    </div>
                    <span className="text-slate-700">{role.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="name@school.com" className="h-11" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-sm text-blue-600 hover:underline">Forgot?</a>
                  </div>
                  <Input id="password" type="password" className="h-11" />
                </div>
              </div>

              <Button 
                className="w-full h-11 bg-blue-600 hover:bg-blue-700" 
                onClick={() => selectedRole && onLogin(selectedRole)}
                disabled={!selectedRole}
              >
                Sign In to Portal
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">Need help?</span>
                </div>
              </div>

              <p className="text-center text-sm text-slate-500">
                Contact your IT department for account issues.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;