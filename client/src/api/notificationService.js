import axios from 'axios';

// Use VITE_API_URL from environment variables, or fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/notifications`
  : 'https://server-sand-kappa-36.vercel.app/api/notifications';

const getApiClient = (token) => {
  return axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getNotifications = (token) => {
  const api = getApiClient(token);
  return api.get('/');
};

const notificationService = {
  getNotifications,
};

export default notificationService;