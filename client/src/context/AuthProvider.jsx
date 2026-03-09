import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context that our components will use
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage to persist login
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // This effect ensures that any time the token changes, we update the user state.
  useEffect(() => {
    if (token && !user) {
      // In a real app, you might decode the token here to get user details.
      // For now, we'll just set a basic user object if a token exists.
      setUser(JSON.parse(localStorage.getItem('user')));
    }
    // This loading state prevents the app from flickering to the login page on a refresh.
    setLoading(false);
  }, [token, user]);

  // The function that will be called from our LoginPage
  const login = (data) => {
    // 1. Store the token and user details in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // 2. Update the state
    setToken(data.token);
    setUser(data.user);

    // 3. Redirect the user to their main dashboard
    navigate('/tasks');
  };

  // The function to log the user out
  const logout = () => {
    // 1. Clear everything from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // 2. Clear AI chat history from sessionStorage
    sessionStorage.removeItem('dashAiChatHistory');

    // 3. Clear the state
    setToken(null);
    setUser(null);

    // 4. Redirect to the home page
    navigate('/home');
  };

  // The value that will be provided to all child components
  const value = {
    token,
    user,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;