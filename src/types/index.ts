export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'student' | 'employee';
  avatar?: string;
  phone?: string;
  createdAt: string;
  preferences: {
    notifications: boolean;
    emailReminders: boolean;
    smsReminders: boolean;
    theme: 'light' | 'dark';
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'work' | 'personal' | 'project';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  attachments?: string[];
  tags: string[];
  estimatedTime?: number;
  actualTime?: number;
  reminderTimes: string[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'reminder' | 'deadline' | 'update' | 'achievement';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  taskId?: string;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
  productivityScore: number;
}