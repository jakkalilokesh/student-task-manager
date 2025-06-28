import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Edit, 
  Camera,
  Save,
  X,
  Award,
  Target,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuthStore } from '../../store/authStore';
import { format } from 'date-fns';

export const Profile: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: 'Passionate about productivity and efficient task management.',
    location: 'Hyderabad, India',
    website: 'https://jakkalilokesh.dev',
  });

  const handleSave = () => {
    if (user) {
      setUser({
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: 'Passionate about productivity and efficient task management.',
      location: 'Hyderabad, India',
      website: 'https://jakkalilokesh.dev',
    });
    setIsEditing(false);
  };

  const stats = [
    { label: 'Tasks Completed', value: '156', icon: Target, color: 'emerald' },
    { label: 'Total Projects', value: '12', icon: Award, color: 'blue' },
    { label: 'Hours Tracked', value: '324', icon: Clock, color: 'purple' },
    { label: 'Productivity Score', value: '92%', icon: TrendingUp, color: 'orange' },
  ];

  const achievements = [
    { title: 'Task Master', description: 'Completed 100+ tasks', date: '2024-01-15', earned: true },
    { title: 'Early Bird', description: 'Completed tasks before deadline', date: '2024-01-10', earned: true },
    { title: 'Team Player', description: 'Collaborated on 10+ projects', date: '2024-01-05', earned: true },
    { title: 'Consistency King', description: '30-day streak', date: null, earned: false },
  ];

  const recentActivity = [
    { action: 'Completed task', item: 'Project proposal review', time: '2 hours ago' },
    { action: 'Created project', item: 'Mobile app development', time: '1 day ago' },
    { action: 'Updated profile', item: 'Added new skills', time: '3 days ago' },
    { action: 'Earned achievement', item: 'Task Master badge', time: '1 week ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account and preferences</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} icon={Edit}>
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleSave} icon={Save}>
              Save Changes
            </Button>
            <Button onClick={handleCancel} variant="outline" icon={X}>
              Cancel
            </Button>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card className="p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'JL'}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Name"
                  />
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email"
                    type="email"
                  />
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone"
                    type="tel"
                  />
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Bio"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  />
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Location"
                  />
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="Website"
                    type="url"
                  />
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-600 capitalize">{user?.userType}</p>
                  <p className="text-sm text-gray-500 mt-2">{formData.bio}</p>
                  
                  <div className="mt-6 space-y-3 text-left">
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{user?.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {format(new Date(user?.createdAt || ''), 'MMM yyyy')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Stats */}
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center">
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Achievements */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    achievement.earned
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.earned ? 'bg-blue-100' : 'bg-gray-200'
                    }`}>
                      <Award className={`w-5 h-5 ${
                        achievement.earned ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h4 className={`font-medium ${
                        achievement.earned ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-sm ${
                        achievement.earned ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>
                      {achievement.earned && achievement.date && (
                        <p className="text-xs text-gray-500 mt-1">
                          Earned on {format(new Date(achievement.date), 'MMM dd, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.action}</span> "{activity.item}"
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </Card>

          {/* Preferences */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive email updates about your tasks</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={user?.preferences.emailReminders}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">SMS Reminders</h4>
                  <p className="text-sm text-gray-600">Get SMS notifications for urgent tasks</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={user?.preferences.smsReminders}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Dark Mode</h4>
                  <p className="text-sm text-gray-600">Use dark theme for better visibility</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={user?.preferences.theme === 'dark'}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};