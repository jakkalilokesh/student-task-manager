import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  FolderOpen, 
  Users, 
  Calendar,
  MoreHorizontal,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ProjectModal } from './ProjectModal';
import { format } from 'date-fns';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high';
  progress: number;
  dueDate: string;
  teamMembers: string[];
  tasksCount: number;
  completedTasks: number;
  color: string;
  isStarred: boolean;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Website',
    description: 'Build a modern e-commerce platform with React and Node.js',
    status: 'in-progress',
    priority: 'high',
    progress: 65,
    dueDate: '2024-02-15',
    teamMembers: ['Jakkali Lokesh', 'John Doe', 'Jane Smith'],
    tasksCount: 24,
    completedTasks: 16,
    color: 'bg-blue-500',
    isStarred: true,
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Create a cross-platform mobile app using React Native',
    status: 'planning',
    priority: 'medium',
    progress: 20,
    dueDate: '2024-03-01',
    teamMembers: ['Jakkali Lokesh', 'Alice Johnson'],
    tasksCount: 18,
    completedTasks: 4,
    color: 'bg-emerald-500',
    isStarred: false,
  },
  {
    id: '3',
    name: 'Data Analytics Dashboard',
    description: 'Build an analytics dashboard for business intelligence',
    status: 'completed',
    priority: 'high',
    progress: 100,
    dueDate: '2024-01-20',
    teamMembers: ['Jakkali Lokesh', 'Bob Wilson', 'Carol Brown'],
    tasksCount: 15,
    completedTasks: 15,
    color: 'bg-purple-500',
    isStarred: true,
  },
];

export const Projects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState(mockProjects);

  // Load projects from localStorage on component mount
  React.useEffect(() => {
    const savedProjects = localStorage.getItem('taskmanager_projects');
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects);
      setProjects([...mockProjects, ...parsedProjects]);
    }
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesStarred = !showStarredOnly || project.isStarred;
    
    return matchesSearch && matchesStatus && matchesStarred;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'on-hold':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <FolderOpen className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      planning: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
      'on-hold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    };
    return badges[status as keyof typeof badges] || badges.planning;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-200',
      medium: 'bg-yellow-300',
      high: 'bg-red-400',
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track your project progress</p>
        </div>
        <Button 
          icon={Plus} 
          className="bg-gradient-to-r from-blue-600 to-purple-600"
          onClick={() => setIsModalOpen(true)}
        >
          New Project
        </Button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
            <Button
              variant={showStarredOnly ? 'primary' : 'outline'}
              onClick={() => setShowStarredOnly(!showStarredOnly)}
              icon={Star}
            >
              Starred
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 h-full hover:shadow-lg transition-all duration-300" hover>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(project.status)}
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(project.priority)}`} />
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Star}
                    className={project.isStarred ? 'text-yellow-500' : 'text-gray-400'}
                  />
                  <Button variant="ghost" size="sm" icon={MoreHorizontal} />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                {project.name}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${project.color}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>{project.completedTasks}/{project.tasksCount} tasks</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(project.dueDate), 'MMM dd')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(project.status)}`}>
                    {project.status.replace('-', ' ')}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{project.teamMembers.length}</span>
                  </div>
                </div>

                <div className="flex -space-x-2">
                  {project.teamMembers.slice(0, 3).map((member, memberIndex) => (
                    <div
                      key={memberIndex}
                      className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-gray-900"
                    >
                      {member.split(' ').map(n => n[0]).join('')}
                    </div>
                  ))}
                  {project.teamMembers.length > 3 && (
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-medium border-2 border-white dark:border-gray-900">
                      +{project.teamMembers.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery || statusFilter !== 'all' || showStarredOnly
              ? 'Try adjusting your search or filters'
              : 'Create your first project to get started'
            }
          </p>
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Create Project</Button>
        </motion.div>
      )}

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};