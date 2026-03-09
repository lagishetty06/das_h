import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './index.css';

// --- Import Providers and Layouts ---
import { AuthProvider, default as AuthContext } from './context/AuthProvider';
import { TaskProvider } from './context/TaskProvider';
import RootLayout from './components/RootLayout';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './router/ProtectedRoute';
import PublicRoute from './router/PublicRoute';

// --- Import All REAL Pages ---
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import VerifyOtpPage from './components/VerifyOtpPage';
import AllTasksPage from './components/AllTasksPage';
import StarredTasksPage from './components/StarredTasksPage';
import CompletedTasksPage from './components/CompletedTasksPage';
import TrashPage from './components/TrashPage';
import ProfilePage from './components/ProfilePage';
import CalendarPage from './components/CalendarPage';
import NotificationsPage from './components/NotificationsPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <Routes>
          {/* --- Public Routes --- */}
          {/* These routes are only accessible if you are LOGGED OUT */}
          <Route element={<PublicRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route path="/verify-otp" element={<VerifyOtpPage />} />

          {/* --- Protected Dashboard Routes --- */}
          {/* This <Route> checks if the user is logged in */}
          <Route element={<ProtectedRoute />}>
            {/* THIS IS THE FIX: This <Route> has NO PATH.
              It acts as a parent wrapper. All its child routes
              will be rendered *inside* the <Outlet /> of <DashboardLayout />.
              This ensures ALL dashboard pages are children of TaskProvider.
            */}
            <Route
              element={
                <TaskProvider>
                  <DashboardLayout />
                </TaskProvider>
              }
            >
              {/* Default dashboard route redirects to /tasks */}
              <Route index element={<Navigate to="/tasks" replace />} />

              {/* All Dashboard pages are children now */}
              <Route path="tasks" element={<AllTasksPage />} />
              <Route path="tasks/starred" element={<StarredTasksPage />} />
              <Route path="tasks/completed" element={<CompletedTasksPage />} />
              <Route path="tasks/trash" element={<TrashPage />} />
              <Route path="tasks/calendar" element={<CalendarPage />} />
              <Route path="tasks/notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />

              {/* Fallback for any unknown dashboard URL */}
              <Route path="*" element={<Navigate to="/tasks" replace />} />
            </Route>
          </Route>

          {/* Fallback for any other unknown URL */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

