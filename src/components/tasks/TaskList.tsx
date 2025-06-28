import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  Calendar,
  Tag,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { format } from 'date-fns';

interface TaskListProps {
  searchQuery: string;
  filters: {
    status: string;
    priority: string;
    category: string;
  };
}

const mockTasks = [
  {
    id: '1',
    title: 'Complete React component library',
    description: 'Build reusable components for the design system',
    category: 'work',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2024-01-15',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-12',
    userId: 'user1',
    tags: ['frontend', 'react', 'ui'],
    estimatedTime: 8,
    actualTime: 5,
    reminderTimes: [],
  },
  {
    id: '2',
    title: 'Study for database management exam',
    description: 'Review SQL queries and database normalization',
    category: 'academic',
    priority: 'urgent',
    status: 'pending',
    dueDate: '2024-01-18',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-10',
    userId: 'user1',
    tags: ['database', 'sql', 'exam'],
    estimatedTime: 12,
    actualTime: 0,
    reminderTimes: [],
  },
  {
    id: '3',
    title: 'Plan weekend hiking trip',
    description: 'Research trails and pack equipment',
    category: 'personal',
    priority: 'low',
    status: 'completed',
    dueDate: '2024-01-20',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-11',
    userId: 'user1',
    tags: ['outdoors', 'planning'],
    estimatedTime: 3,
    actualTime: 2,
    reminderTimes: [],
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

const getCategoryColor = (category: string) => {
  const colors = {
    work: 'bg-blue-100 text-blue-800',
    academic: 'bg-purple-100 text-purple-800',
    personal: 'bg-emerald-100 text-emerald-800',
    project: 'bg-orange-100 text-orange-800',
  };
  return colors[category as keyof typeof colors] || colors.work;
};

export const TaskList: React.FC<TaskListProps> = ({ searchQuery, filters }) => {
  const filteredTasks = mockTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filters.status === 'all' || task.status === filters.status;
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
    const matchesCategory = filters.category === 'all' || task.category === filters.category;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {filteredTasks.map((task, index) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6 hover:shadow-lg transition-all duration-300" hover>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(task.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {task.title}
                    </h3>
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {task.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Due {format(new Date(task.dueDate), 'MMM dd')}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                      {task.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                  {task.tags.length > 0 && (
                    <div className="flex items-center space-x-2 mt-3">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <div className="flex flex-wrap gap-1">
                        {task.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Button variant="ghost" size="sm" icon={Edit}>
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="ghost" size="sm" icon={Trash2}>
                  <span className="sr-only">Delete</span>
                </Button>
                <Button variant="ghost" size="sm" icon={MoreHorizontal}>
                  <span className="sr-only">More options</span>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
      
      {filteredTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500">
            {searchQuery || filters.status !== 'all' || filters.priority !== 'all' || filters.category !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first task to get started'
            }
          </p>
        </motion.div>
      )}
    </div>
  );
};