import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/profile/Profile';
import Dashboard from './pages/dashboard/Dashboard';
import CustomerList from './pages/customers/CustomerList';
import CustomerForm from './pages/customers/CustomerForm';
import TaskList from './pages/tasks/TaskList';
import TaskForm from './pages/tasks/TaskForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { getCurrentUser } from './features/auth/authSlice';
import { Box, CircularProgress } from '@mui/material';

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  // Persist auth on refresh using token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  // While checking current user, block routing to avoid flicker/redirect
  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={56} />
      </Box>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          !isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />
        } />
        <Route path="/register" element={
          !isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />
        } />
        
        <Route path="/" element={
          <ProtectedRoute element={<Layout />} />
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          
          <Route path="customers" element={
            <ProtectedRoute element={<CustomerList />} allowedRoles={['ADMIN']} />
          } />
          <Route path="customers/new" element={
            <ProtectedRoute element={<CustomerForm />} allowedRoles={['ADMIN']} />
          } />
          <Route path="customers/:id" element={
            <ProtectedRoute element={<CustomerForm />} allowedRoles={['ADMIN']} />
          } />
          
          <Route path="tasks" element={<TaskList />} />
          <Route path="tasks/new" element={
            <ProtectedRoute element={<TaskForm />} allowedRoles={['ADMIN']} />
          } />
          <Route path="tasks/:id" element={<TaskForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;