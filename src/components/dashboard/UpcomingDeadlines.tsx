import React from 'react';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import { format, isToday, isTomorrow, addDays } from 'date-fns';

const upcomingDeadlines = [
  {
    id: 1,
    title: 'Submit quarterly report',
    dueDate: new Date(),
    priority: 'urgent',
    category: 'work',
  },
  {
    id: 2,
    title: 'Complete online course assignment',
    dueDate: addDays(new Date(), 1),
    priority: 'high',
    category: 'academic',
  },
  {
    id: 3,
    title: 'Team project milestone',
    dueDate: addDays(new Date(), 3),
    priority: 'medium',
    category: 'project',
  },
  {
    id: 4,
    title: 'Review performance metrics',
    dueDate: addDays(new Date(), 5),
    priority: 'low',
    category: 'work',
  },
];

const formatDeadline = (date: Date) => {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'MMM dd');
};

const getPriorityColor = (priority: string) => {
  const colors = {
    low: 'text-gray-600 bg-gray-100',
    medium: 'text-yellow-700 bg-yellow-100',
    high: 'text-orange-700 bg-orange-100',
    urgent: 'text-red-700 bg-red-100',
  };
  return colors[priority as keyof typeof colors] || colors.low;
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'work':
      return <Clock className="w-4 h-4" />;
    case 'academic':
      return <Calendar className="w-4 h-4" />;
    case 'project':
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <Calendar className="w-4 h-4" />;
  }
};

export const UpcomingDeadlines: React.FC = () => {
  return (
    <div className="space-y-4">
      {upcomingDeadlines.map((deadline) => (
        <div key={deadline.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              {getCategoryIcon(deadline.category)}
            </div>
            <div>
              <p className="font-medium text-gray-900">{deadline.title}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {formatDeadline(deadline.dueDate)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getPriorityColor(deadline.priority)}`}>
              {deadline.priority}
            </span>
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full capitalize">
              {deadline.category}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};