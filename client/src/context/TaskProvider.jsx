import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import taskService from '../api/taskService';
import notificationService from '../api/notificationService';
import AuthContext from './AuthProvider';
import { toast } from 'react-toastify';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  // --- Master Lists (Raw data from API) ---
  const [tasks, setTasks] = useState([]);
  const [starredTasks, setStarredTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [trashTasks, setTrashTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [_lastViewedTime, setLastViewedTime] = useState(() => {
    // Load last viewed time from localStorage
    const saved = localStorage.getItem('notificationsLastViewed');
    return saved ? new Date(saved) : null;
  });

  // --- Search & Loading State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get auth info from AuthContext
  const { token, isAuthenticated } = useContext(AuthContext);

  // --- Core Data Fetching Function ---
  // We use useCallback to stabilize this function, so it doesn't cause unnecessary re-renders
  const refetchAllData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      // Fetch all data in parallel
      const [all, starred, completed, trash, notifs] = await Promise.all([
        taskService.getAllTasks(token),
        taskService.getStarredTasks(token),
        taskService.getCompletedTasks(token),
        taskService.getDeletedTasks(token),
        notificationService.getNotifications(token),
      ]);
      setTasks(all.data);
      setStarredTasks(starred.data);
      setCompletedTasks(completed.data);
      setTrashTasks(trash.data);
      setNotifications(notifs.data);

      // Calculate unread count based on last viewed time
      const savedTime = localStorage.getItem('notificationsLastViewed');
      const lastViewed = savedTime ? new Date(savedTime) : null;

      if (lastViewed) {
        const unread = notifs.data.filter(n => new Date(n.createdAt) > lastViewed).length;
        setUnreadCount(unread);
      } else {
        setUnreadCount(notifs.data.length);
      }
    } catch {
      setError('Failed to fetch data.');
      toast.error('Failed to load data. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  }, [token]); // This function only changes if the token changes

  // --- Effect to fetch data on login/logout ---
  useEffect(() => {
    if (isAuthenticated) {
      refetchAllData();
    } else {
      // Clear all state on logout
      setTasks([]); setStarredTasks([]); setCompletedTasks([]);
      setTrashTasks([]); setNotifications([]); setLoading(false);
    }
  }, [isAuthenticated, refetchAllData]);

  // --- Task Action Functions ---
  const addTask = useCallback(async (taskData) => {
    try {
      await taskService.createTask(taskData, token);
      await refetchAllData(); // Refetch all lists to ensure sync
      toast.success('Task added successfully!');
    } catch (e) {
      toast.error('Failed to add task.');
      throw e; // Re-throw error for the modal to catch
    }
  }, [token, refetchAllData]);

  const updateTask = useCallback(async (taskId, updateData) => {
    try {
      await taskService.updateTask(taskId, updateData, token);
      await refetchAllData(); // Refetch all lists
      toast.success('Task updated!');
    } catch {
      toast.error('Failed to update task.');
    }
  }, [token, refetchAllData]);

  const deleteTask = useCallback(async (taskId) => {
    try {
      await taskService.deleteTask(taskId, token);
      await refetchAllData(); // Refetch all lists
      toast.info('Task moved to trash.');
    } catch {
      toast.error('Failed to move task to trash.');
    }
  }, [token, refetchAllData]);

  const restoreTask = useCallback(async (taskId) => {
    try {
      await taskService.updateTask(taskId, { isDeleted: false }, token);
      await refetchAllData(); // Refetch all lists
      toast.success('Task restored successfully!');
    } catch {
      toast.error('Failed to restore task.');
    }
  }, [token, refetchAllData]);

  // --- NEW Batch Delete Function ---
  const deleteMultipleTasksPermanently = useCallback(async (taskIds) => {
    if (!taskIds || taskIds.length === 0) return;
    try {
      await taskService.deleteTasksPermanently(taskIds, token);
      await refetchAllData(); // Refresh all lists
      toast.success(`Successfully deleted ${taskIds.length} tasks permanently.`);
    } catch {
      toast.error('Failed to permanently delete tasks.');
    }
  }, [token, refetchAllData]);
  // --- END NEW FUNCTION ---

  // --- Mark Notifications as Read ---
  const markNotificationsAsRead = useCallback(() => {
    const now = new Date();
    setLastViewedTime(now);
    setUnreadCount(0);
    localStorage.setItem('notificationsLastViewed', now.toISOString());
  }, []);

  // --- Memoized Filtering Logic ---
  const filterTasks = useCallback((taskList) => {
    if (!searchTerm.trim()) return taskList;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return taskList.filter(task =>
      task.title.toLowerCase().includes(lowerCaseSearch) ||
      (task.description && task.description.toLowerCase().includes(lowerCaseSearch))
    );
  }, [searchTerm]);

  // --- Smart Task Prioritization Function ---
  // Criteria: 1) Priority, 2) Due Date, 3) Reminders
  const prioritizeTasks = useCallback((taskList) => {
    return [...taskList].sort((a, b) => {
      // Criterion 1: Priority (Higher priority first)
      if (a.priority !== b.priority) {
        return b.priority - a.priority; // Descending order
      }

      // Criterion 2: Due Date (Earlier due date first)
      const aDueDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bDueDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;

      if (aDueDate !== bDueDate) {
        return aDueDate - bDueDate; // Ascending order (earliest first)
      }

      // Criterion 3: Reminders (Tasks with reminders first)
      const aHasReminders = a.alarms && a.alarms.length > 0;
      const bHasReminders = b.alarms && b.alarms.length > 0;

      if (aHasReminders !== bHasReminders) {
        return bHasReminders ? 1 : -1; // Tasks with reminders come first
      }

      // If all criteria are equal, maintain original order
      return 0;
    });
  }, []);

  const filteredTasks = useMemo(() => prioritizeTasks(filterTasks(tasks)), [tasks, filterTasks, prioritizeTasks]);
  const filteredStarredTasks = useMemo(() => prioritizeTasks(filterTasks(starredTasks)), [starredTasks, filterTasks, prioritizeTasks]);
  const filteredCompletedTasks = useMemo(() => filterTasks(completedTasks), [completedTasks, filterTasks]);
  const filteredTrashTasks = useMemo(() => filterTasks(trashTasks), [trashTasks, filterTasks]);

  // --- Final Context Value ---
  const value = {
    tasks: filteredTasks,
    starredTasks: filteredStarredTasks,
    completedTasks: filteredCompletedTasks,
    trashTasks: filteredTrashTasks,
    notifications,
    unreadCount,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    addTask,
    updateTask,
    deleteTask,
    restoreTask,
    deleteMultipleTasksPermanently, // Expose the new function
    markNotificationsAsRead,
    refetchTasks: refetchAllData,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;






