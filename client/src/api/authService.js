import axios from 'axios';

// Use VITE_API_URL from environment variables, or fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/auth`
  : 'http://localhost:4000/api/auth';

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

// --- THIS IS THE NEW FUNCTION ---
const updateProfile = (profileData, token) => {
  const api = getApiClient(token);
  // This calls the protected PUT /api/auth/profile route
  return api.put('/profile', profileData);
}


const authService = {
  register,
  verifyOtp,
  login,
  resendOtp,
  updateProfile, // Add the new function to the export
};

export default authService;