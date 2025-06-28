import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, User, Notification } from '../types';

interface DataState {
  users: User[];
  tasks: Task[];
  notifications: Notification[];
  addUser: (user: User) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  getUserTasks: (userId: string) => Task[];
  getUserNotifications: (userId: string) => Notification[];
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      users: [],
      tasks: [],
      notifications: [],
      
      addUser: (user) =>
        set((state) => ({
          users: [...state.users, user],
        })),
      
      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
        })),
      
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
          ),
        })),
      
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      
      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),
      
      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, isRead: true } : notification
          ),
        })),
      
      getUserTasks: (userId) => {
        const state = get();
        return state.tasks.filter((task) => task.userId === userId);
      },
      
      getUserNotifications: (userId) => {
        const state = get();
        return state.notifications.filter((notification) => notification.userId === userId);
      },
    }),
    {
      name: 'taskmanager-data-storage',
    }
  )
);