// frontend/src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // ✅ This should now work

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'super_admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;