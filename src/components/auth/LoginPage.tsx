import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Smartphone, ArrowRight, CheckSquare, Bell, BarChart3 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuthStore } from '../../store/authStore';
import { demoCredentials } from '../../config/aws-config';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
  });

  const { setUser, setLoading } = useAuthStore();

  const handleDemoLogin = (userType: 'student' | 'employee') => {
    setIsLoading(true);
    
    // Simulate demo login
    setTimeout(() => {
      const demoUser = {
        id: `demo-${userType}-${Date.now()}`,
        email: demoCredentials[userType].email,
        name: userType === 'student' ? 'Jakkali Lokesh' : 'Jakkali Lokesh',
        userType,
        avatar: '',
        phone: '+91 9876543210',
        createdAt: new Date().toISOString(),
        preferences: {
          notifications: true,
          emailReminders: true,
          smsReminders: true,
          theme: 'light' as const,
        },
      };
      
      setUser(demoUser);
      setIsLoading(false);
      toast.success(`Welcome ${demoUser.name}!`);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Check if credentials match demo accounts
    const isStudentDemo = formData.email === demoCredentials.student.email && 
                         formData.password === demoCredentials.student.password;
    const isEmployeeDemo = formData.email === demoCredentials.employee.email && 
                          formData.password === demoCredentials.employee.password;
    
    setTimeout(() => {
      if (isStudentDemo) {
        handleDemoLogin('student');
      } else if (isEmployeeDemo) {
        handleDemoLogin('employee');
      } else {
        // For new registrations, create a new user
        const newUser = {
          id: `user-${Date.now()}`,
          email: formData.email,
          name: 'New User',
          userType: 'student' as const,
          avatar: '',
          phone: formData.phone || '+91 9876543210',
          createdAt: new Date().toISOString(),
          preferences: {
            notifications: true,
            emailReminders: true,
            smsReminders: true,
            theme: 'light' as const,
          },
        };
        
        // Store user data in localStorage (simulating database)
        const existingUsers = JSON.parse(localStorage.getItem('taskmanager_users') || '[]');
        existingUsers.push(newUser);
        localStorage.setItem('taskmanager_users', JSON.stringify(existingUsers));
        
        setUser(newUser);
        toast.success('Account created successfully!');
      }
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white opacity-20 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">T</span>
              </div>
              <div className="ml-4">
                <h1 className="text-4xl font-bold text-white">TaskManager Pro</h1>
                <p className="text-blue-200">Student & Employee Task Management</p>
              </div>
            </div>
            
            <div className="space-y-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <CheckSquare className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Smart Task Management</h3>
                  <p className="text-blue-200">Organize, prioritize, and track your tasks efficiently</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Smart Notifications</h3>
                  <p className="text-blue-200">Never miss a deadline with our intelligent reminder system</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Analytics & Insights</h3>
                  <p className="text-blue-200">Track your productivity and optimize your workflow</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-blue-200">Sign in to manage your tasks</p>
              </div>

              {/* Demo Login Buttons */}
              <div className="space-y-3 mb-8">
                <h3 className="text-sm font-medium text-blue-200 text-center">Quick Demo Access</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleDemoLogin('student')}
                    disabled={isLoading}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-white border border-blue-300/30"
                  >
                    Student Demo
                  </Button>
                  <Button
                    onClick={() => handleDemoLogin('employee')}
                    disabled={isLoading}
                    className="bg-purple-500/20 hover:bg-purple-500/30 text-white border border-purple-300/30"
                  >
                    Employee Demo
                  </Button>
                </div>
              </div>

              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-blue-200">Or continue with</span>
                </div>
              </div>

              {/* Login Method Toggle */}
              <div className="flex bg-white/10 rounded-lg p-1 mb-6">
                <button
                  onClick={() => setLoginMethod('email')}
                  className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all duration-200 ${
                    loginMethod === 'email'
                      ? 'bg-white/20 text-white'
                      : 'text-blue-200 hover:text-white'
                  }`}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </button>
                <button
                  onClick={() => setLoginMethod('phone')}
                  className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all duration-200 ${
                    loginMethod === 'phone'
                      ? 'bg-white/20 text-white'
                      : 'text-blue-200 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Phone
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {loginMethod === 'email' ? (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-blue-200">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 text-white placeholder-blue-200"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-blue-200">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 text-white placeholder-blue-200"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-blue-200">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 text-white placeholder-blue-200"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-blue-200">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-blue-300 hover:text-white transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  loading={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-blue-200">
                  Don't have an account?{' '}
                  <button className="text-white font-medium hover:underline">
                    Sign up
                  </button>
                </p>
              </div>

              {/* Demo Credentials Display */}
              <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-sm font-medium text-blue-200 mb-2">Demo Credentials:</h4>
                <div className="space-y-1 text-xs text-blue-300">
                  <p><strong>Student:</strong> {demoCredentials.student.email}</p>
                  <p><strong>Password:</strong> {demoCredentials.student.password}</p>
                  <p><strong>Employee:</strong> {demoCredentials.employee.email}</p>
                  <p><strong>Password:</strong> {demoCredentials.employee.password}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Signing you in...</p>
            <p className="text-blue-200 text-sm mt-2">Setting up your workspace</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};