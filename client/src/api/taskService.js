import axios from 'axios';

// Use VITE_API_URL from environment variables, or fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/tasks`
  : 'http://localhost:4000/api/tasks';

// This function creates a configured axios instance that includes the user's token
const getApiClient = (token) => {
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return api;
};

// --- API Functions ---

const getAllTasks = (token) => {
  const api = getApiClient(token);
  return api.get('/');
};

const createTask = (taskData, token) => {
  const api = getApiClient(token);
  return api.post('/', taskData);
};

const updateTask = (taskId, updateData, token) => {
  const api = getApiClient(token);
  return api.put(`/${taskId}`, updateData);
};

const deleteTask = (taskId, token) => {
  const api = getApiClient(token);
  return api.delete(`/${taskId}`);
};

// --- THIS IS THE NEW FUNCTION ---
// It sends a DELETE request to the root '/' endpoint
// with a 'data' payload containing the array of task IDs.
const deleteTasksPermanently = (taskIds, token) => {
  const api = getApiClient(token);
  return api.delete('/', { data: { taskIds } });
};


const getStarredTasks = (token) => {
  const api = getApiClient(token);
  return api.get('/starred');
};

const getCompletedTasks = (token) => {
  const api = getApiClient(token);
  return api.get('/completed');
};

const getDeletedTasks = (token) => {
  const api = getApiClient(token);
  return api.get('/deleted');
};


const taskService = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  deleteTasksPermanently, // <-- ADD THE NEW FUNCTION TO THE EXPORT
  getStarredTasks,
  getCompletedTasks,
  getDeletedTasks,
};

export default taskService;











