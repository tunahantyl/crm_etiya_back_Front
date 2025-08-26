import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
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
        <Box
          sx={{
            p: 3,
            display: 'grid',
            gap: 24,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: isAdmin ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)'
            },
          }}
        >
          {isAdmin ? (
            <>
              <Box>
                <StatCard
                  title="Toplam Müşteri"
                  value={adminStats?.totalCustomers || 0}
                  icon={<PeopleIcon />}
                  color="#667eea"
                />
              </Box>
              <Box>
                <StatCard
                  title="Toplam Görev"
                  value={adminStats?.totalTasks || 0}
                  icon={<AssignmentIcon />}
                  color="#764ba2"
                />
              </Box>
              <Box>
                <StatCard
                  title="Tamamlanan Görevler"
                  value={adminStats?.completedTasks || 0}
                  icon={<CheckCircleIcon />}
                  color="#f093fb"
                />
              </Box>
              <Box>
                <StatCard
                  title="Bekleyen Görevler"
                  value={adminStats?.pendingTasks || 0}
                  icon={<AccessTimeIcon />}
                  color="#f5576c"
                />
              </Box>
            </>
          ) : (
            <>
              <Box>
                <StatCard
                  title="Atanan Görevler"
                  value={userStats?.assignedTasks || 0}
                  icon={<AssignmentIcon />}
                  color="#667eea"
                />
              </Box>
              <Box>
                <StatCard
                  title="Tamamladığım Görevler"
                  value={userStats?.completedTasks || 0}
                  icon={<CheckCircleIcon />}
                  color="#f093fb"
                />
              </Box>
              <Box>
                <StatCard
                  title="Bekleyen Görevlerim"
                  value={userStats?.pendingTasks || 0}
                  icon={<AccessTimeIcon />}
                  color="#f5576c"
                />
              </Box>
            </>
          )}
        </Box>

        <Box
          sx={{
            p: 3,
            pt: 0,
            display: 'grid',
            gap: 24,
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          }}
        >
          <Box>
            <TaskStatusChart data={taskStatusChart || { pending: 0, inProgress: 0, completed: 0 }} />
          </Box>
          <Box>
            <TaskTrendChart data={monthlyTrends || { labels: [], completed: [], created: [] }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;