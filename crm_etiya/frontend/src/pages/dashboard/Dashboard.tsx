import { Box, Typography, Grid, Paper, CircularProgress, Alert } from '@mui/material';
import StatCard from '../../components/dashboard/StatCard';
import TaskStatusChart from '../../components/dashboard/TaskStatusChart';
import TaskTrendChart from '../../components/dashboard/TaskTrendChart';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { fetchStats, fetchUserStats, fetchAdminStats, fetchTaskStatusChart, fetchMonthlyTrends } from '../../features/dashboard/dashboardSlice';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { pageContainerStyles, pageHeaderStyles } from '../../styles/commonStyles';
import { useEffect } from 'react';



const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { stats, userStats, adminStats, taskStatusChart, monthlyTrends, loading, error } = useAppSelector((state) => state.dashboard);
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchAdminStats());
    } else {
      dispatch(fetchUserStats());
    }
    dispatch(fetchTaskStatusChart());
    dispatch(fetchMonthlyTrends());
  }, [dispatch, isAdmin]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  const currentStats = isAdmin ? adminStats : userStats;
  const displayStats = isAdmin ? adminStats : { ...stats, ...userStats };

  return (
    <Box>
      <Box sx={pageHeaderStyles}>
        <Typography variant="h5" fontWeight="medium">
          {isAdmin ? 'Yönetici Paneli' : 'Görev Takip Paneli'}
        </Typography>
      </Box>

      <Box sx={{ ...pageContainerStyles, p: 0 }}>
        <Grid container spacing={3} sx={{ p: 3 }}>
          {isAdmin ? (
            // Admin Dashboard
            <>
              <Grid xs={12} sm={6} md={3}>
                <StatCard
                  title="Toplam Müşteri"
                  value={adminStats?.totalCustomers || 0}
                  icon={<PeopleIcon />}
                  color="#667eea"
                />
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <StatCard
                  title="Toplam Görev"
                  value={adminStats?.totalTasks || 0}
                  icon={<AssignmentIcon />}
                  color="#764ba2"
                />
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <StatCard
                  title="Tamamlanan Görevler"
                  value={adminStats?.completedTasks || 0}
                  icon={<CheckCircleIcon />}
                  color="#f093fb"
                />
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <StatCard
                  title="Bekleyen Görevler"
                  value={adminStats?.pendingTasks || 0}
                  icon={<AccessTimeIcon />}
                  color="#f5576c"
                />
              </Grid>
            </>
          ) : (
            // User Dashboard
            <>
              <Grid xs={12} sm={6} md={4}>
                <StatCard
                  title="Atanan Görevler"
                  value={userStats?.assignedTasks || 0}
                  icon={<AssignmentIcon />}
                  color="#667eea"
                />
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <StatCard
                  title="Tamamladığım Görevler"
                  value={userStats?.completedTasks || 0}
                  icon={<CheckCircleIcon />}
                  color="#f093fb"
                />
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <StatCard
                  title="Bekleyen Görevlerim"
                  value={userStats?.pendingTasks || 0}
                  icon={<AccessTimeIcon />}
                  color="#f5576c"
                />
              </Grid>
            </>
          )}

          {/* Grafikler */}
          <Grid item xs={12} md={6}>
            <TaskStatusChart data={taskStatusChart || { pending: 0, inProgress: 0, completed: 0 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TaskTrendChart data={monthlyTrends || { labels: [], completed: [], created: [] }} />
          </Grid>

          {/* Yakında eklenecek: Son aktiviteler, yaklaşan görevler tablosu */}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;