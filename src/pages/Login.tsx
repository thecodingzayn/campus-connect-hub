import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '@/types';
import { IMAGES, AUTH_MESSAGES, DEMO_CREDENTIALS, USER_ROLES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, ShieldCheck, UserCog, Heart, Loader2, Info, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signInWithEmail } from '@/lib/supabase';
import { toast } from 'sonner';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const roles = [
    { id: USER_ROLES.ADMIN, label: 'Administrator', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: USER_ROLES.STAFF, label: 'Staff / Teachers', icon: UserCog, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: USER_ROLES.STUDENT, label: 'Student', icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-100' },
    { id: USER_ROLES.PARENT, label: 'Parent', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-100' },
  ];

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast.error(AUTH_MESSAGES.SELECT_PORTAL);
      return;
    }

    if (!email || !password) {
      toast.error(AUTH_MESSAGES.REQUIRED_FIELDS);
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Check if it's a demo account for quick bypass
      const isDemo = DEMO_CREDENTIALS.find(
        (demo) => 
          demo.email.toLowerCase() === email.toLowerCase() && 
          demo.password === password && 
          demo.role === selectedRole
      );

      if (isDemo) {
        await new Promise(resolve => setTimeout(resolve, 800));
        toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
        onLogin(selectedRole);
        return;
      }

      // Step 2: Fallback to real Supabase Auth
      const { data, error } = await signInWithEmail(email, password);

      if (error) {
        toast.error(error.message || AUTH_MESSAGES.INVALID_CREDENTIALS);
        return;
      }

      if (data.user) {
        toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
        onLogin(selectedRole);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      // Safety net for demo even on network error
      const isDemo = DEMO_CREDENTIALS.find(
        (demo) => 
          demo.email.toLowerCase() === email.toLowerCase() && 
          demo.password === password && 
          demo.role === selectedRole
      );

      if (isDemo) {
        toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
        onLogin(selectedRole);
      } else {
        toast.error(AUTH_MESSAGES.GENERIC_ERROR);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (demo: typeof DEMO_CREDENTIALS[0]) => {
    setSelectedRole(demo.role as UserRole);
    setEmail(demo.email);
    setPassword(demo.password);
    toast.info(`Filled ${demo.role} credentials!`);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* Left side: Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3 text-white mb-12"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="text-blue-600" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight">EduFlow</span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-extrabold text-white leading-tight max-w-md"
          >
            The complete management system for modern schools.
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-blue-100 text-lg max-w-md leading-relaxed"
          >
            Empowering administrators, teachers, students, and parents with a unified platform for excellence in education.
          </motion.p>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 flex items-center gap-4 text-blue-100"
        >
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-blue-600 bg-slate-200 overflow-hidden shadow-sm">
                <img 
                  src={`${IMAGES.STUDENT}?sig=${i}`} 
                  alt="User" 
                  className="w-full h-full object-cover" 
                />
              </div>
            ))}
          </div>
          <p className="text-sm font-medium">Join over 2,500+ schools worldwide</p>
        </motion.div>

        {/* Decorative background elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-700 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10">
          <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[440px]"
        >
          <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-md">
            <CardHeader className="space-y-1 pb-8 text-center">
              <div className="lg:hidden flex justify-center mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ShieldCheck className="text-white" size={28} />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</CardTitle>
              <CardDescription className="text-slate-500">Select your portal and enter your credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((role) => (
                    <motion.button
                      key={role.id}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedRole(role.id as UserRole)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 text-sm font-semibold",
                        selectedRole === role.id 
                          ? "border-blue-600 bg-blue-50/80 shadow-sm" 
                          : "border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn("w-11 h-11 rounded-full flex items-center justify-center shadow-sm mb-1", role.bg, role.color)}>
                        <role.icon size={22} />
                      </div>
                      <span className={cn("transition-colors", selectedRole === role.id ? "text-blue-700" : "text-slate-600")}>
                        {role.label}
                      </span>
                    </motion.button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="name@school.com" 
                      className="h-12 border-slate-200 focus:ring-blue-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                      <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">Forgot password?</button>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022\\u2022"
                      className="h-12 border-slate-200 focus:ring-blue-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  size="lg"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-base font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                  disabled={!selectedRole || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In to Portal <ArrowRight size={18} />
                    </span>
                  )}
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase font-bold tracking-wider">
                    <span className="bg-white px-3 text-slate-400">Demo Resources</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowDemoInfo(!showDemoInfo)}
                    className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors font-medium"
                  >
                    <Info size={16} />
                    {showDemoInfo ? 'Hide Demo Credentials' : 'Need help logging in?'}
                  </button>

                  <AnimatePresence>
                    {showDemoInfo && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3 shadow-inner">
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-tight mb-2">Test Accounts</p>
                          <div className="grid grid-cols-1 gap-2">
                            {DEMO_CREDENTIALS.map((demo) => (
                              <button
                                key={demo.role}
                                type="button"
                                onClick={() => fillDemo(demo)}
                                className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all text-left"
                              >
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-slate-700 capitalize">{demo.role}</span>
                                  <span className="text-[10px] text-slate-500">{demo.email}</span>
                                </div>
                                <div className="text-[10px] px-2 py-1 bg-slate-100 rounded text-slate-600 font-mono">
                                  Use this
                                </div>
                              </button>
                            ))}
                          </div>
                          <p className="text-[10px] text-slate-400 italic text-center">
                            Note: Password is "password123" for all accounts
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="text-center mt-8 text-sm text-slate-500">
            Don't have an account? <a href="#" className="font-bold text-blue-600 hover:underline">Contact Admin</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;