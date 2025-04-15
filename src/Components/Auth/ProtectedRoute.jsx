// Components/Auth/ProtectedRoute.jsx
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';
import { auth } from '../../firebase';

const ProtectedRoute = ({ children, allowed }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  if (!user || (allowed && !allowed.includes(user.email))) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
