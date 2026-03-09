import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import RootLayout from '../components/RootLayout';

const PublicRoute = () => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    return isAuthenticated ? <Navigate to="/tasks" replace /> : <RootLayout />;
};

export default PublicRoute;
