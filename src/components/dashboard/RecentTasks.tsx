import React from 'react';
import { CheckSquare, Clock, AlertTriangle } from 'lucide-react';

const recentTasks = [
  {
    id: 1,
    title: 'Complete project proposal',
    status: 'completed',
    time: '2 hours ago',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Review team presentations',
    status: 'pending',
    time: '4 hours ago',
    priority: 'medium',
  },
  {
    id: 3,
    title: 'Update documentation',
    status: 'in-progress',
    time: '6 hours ago',
    priority: 'low',
  },
  {
    id: 4,
    title: 'Client meeting preparation',
    status: 'overdue',
    time: '1 day ago',
    priority: 'urgent',
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckSquare className="w-5 h-5 text-emerald-600" />;
    case 'in-progress':
      return <Clock className="w-5 h-5 text-blue-600" />;
    case 'overdue':
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    default:
      return <Clock className="w-5 h-5 text-gray-400" />;
  }
};

const getStatusBadge = (status: string) => {
  const badges = {
    completed: 'bg-emerald-100 text-emerald-800',
    pending: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    overdue: 'bg-red-100 text-red-800',
  };
  return badges[status as keyof typeof badges] || badges.pending;
};

const getPriorityColor = (priority: string) => {
  const colors = {
    low: 'bg-gray-200',
    medium: 'bg-yellow-300',
    high: 'bg-orange-400',
    urgent: 'bg-red-500',
  };
  return colors[priority as keyof typeof colors] || colors.low;
};

export const RecentTasks: React.FC = () => {
  return (
    <div className="space-y-4">
      {recentTasks.map((task) => (
        <div key={task.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
          <div className="flex-shrink-0">
            {getStatusIcon(task.status)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {task.title}
            </p>
            <p className="text-sm text-gray-500">{task.time}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(task.status)}`}>
              {task.status.replace('-', ' ')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};