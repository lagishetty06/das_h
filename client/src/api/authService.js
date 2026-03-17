import axios from 'axios';

// Use VITE_API_URL from environment variables, or fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/auth`
  : 'https://server-sand-kappa-36.vercel.app/api/auth';

const getApiClient = (token) => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

const verifyOtp = (verificationData) => {
  return axios.post(`${API_URL}/verify-otp`, verificationData);
};

const login = (userData) => {
  return axios.post(`${API_URL}/login`, userData);
};

const resendOtp = (email) => {
  return axios.post(`${API_URL}/resend-otp`, { email });
};

const updateProfile = (profileData, token) => {
  const api = getApiClient(token);
  return api.put('/profile', profileData);
};

// Google Sign-In via Firebase — sends user info, receives DASH JWT
const googleAuth = (googleData) => {
  return axios.post(`${import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth` : 'https://server-sand-kappa-36.vercel.app/api/auth'}/google`, googleData);
};

const authService = {
  register,
  verifyOtp,
  login,
  resendOtp,
  updateProfile,
  googleAuth,
};

export default authService;