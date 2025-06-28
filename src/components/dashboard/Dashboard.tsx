import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Target,
  Award,
  Zap
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import { TaskChart } from './TaskChart';
import { RecentTasks } from './RecentTasks';
import { UpcomingDeadlines } from './UpcomingDeadlines';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { stats } = useTaskStore();

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks || 24,
      icon: CheckSquare,
      color: 'blue',
      change: '+12%',
    },
    {
      title: 'Completed',
      value: stats.completedTasks || 18,
      icon: Target,
      color: 'emerald',
      change: '+8%',
    },
    {
      title: 'In Progress',
      value: stats.pendingTasks || 4,
      icon: Clock,
      color: 'yellow',
      change: '+2%',
    },
    {
      title: 'Overdue',
      value: stats.overdueTasks || 2,
      icon: AlertTriangle,
      color: 'red',
      change: '-5%',
    },
  ];

  const achievements = [
    { title: 'Task Master', description: 'Completed 100+ tasks', icon: Award },
    { title: 'Early Bird', description: '5 days ahead of schedule', icon: Zap },
    { title: 'Consistency', description: '30 day streak', icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              You have {stats.pendingTasks || 4} pending tasks and {stats.overdueTasks || 2} overdue items.
            </p>
            <div className="mt-4 flex items-center space-x-4">
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">Productivity Score</span>
                <div className="text-2xl font-bold">{stats.productivityScore || 85}%</div>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">Completion Rate</span>
                <div className="text-2xl font-bold">{stats.completionRate || 75}%</div>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
              <Calendar className="w-16 h-16 text-white/80" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-xl transition-all duration-300" hover>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${
                        stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last week</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <Icon className={`w-8 h-8 text-${stat.color}-600`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Task Progress</h3>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <TaskChart />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Tasks</h3>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <RecentTasks />
          </Card>
        </motion.div>
      </div>

      {/* Upcoming Deadlines and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Upcoming Deadlines</h3>
            <UpcomingDeadlines />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Achievements</h3>
            <div className="space-y-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{achievement.title}</p>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button className="w-full mt-6" variant="outline">
              View All Achievements
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};