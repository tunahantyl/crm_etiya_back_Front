import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import type { ReactElement } from 'react';

interface ProtectedRouteProps {
  element: ReactElement;
  allowedRoles?: ('ADMIN' | 'MANAGER' | 'USER')[];
}

const ProtectedRoute = ({ element, allowedRoles = [] }: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);

  // While auth is being resolved, show spinner to avoid redirect flicker
  if (loading) {
    return (
      <Box sx={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={36} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role || 'USER')) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

export default ProtectedRoute;