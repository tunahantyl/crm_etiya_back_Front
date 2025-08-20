import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardService from '../../services/api/dashboardService';
import type { DashboardStats, UserStats, AdminStats, TaskStatusChart, MonthlyTrends } from '../../services/api/dashboardService';

interface DashboardState {
  stats: DashboardStats | null;
  userStats: UserStats | null;
  adminStats: AdminStats | null;
  taskStatusChart: TaskStatusChart | null;
  monthlyTrends: MonthlyTrends | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  userStats: null,
  adminStats: null,
  taskStatusChart: null,
  monthlyTrends: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getStats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  'dashboard/fetchUserStats',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getUserStats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user stats');
    }
  }
);

export const fetchAdminStats = createAsyncThunk(
  'dashboard/fetchAdminStats',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getAdminStats();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin stats');
    }
  }
);

export const fetchTaskStatusChart = createAsyncThunk(
  'dashboard/fetchTaskStatusChart',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getTaskStatusChart();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch chart data');
    }
  }
);

export const fetchMonthlyTrends = createAsyncThunk(
  'dashboard/fetchMonthlyTrends',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getMonthlyTrends();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trends');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetDashboard: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchStats
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchUserStats
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.userStats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchAdminStats
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.adminStats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchTaskStatusChart
      .addCase(fetchTaskStatusChart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskStatusChart.fulfilled, (state, action) => {
        state.loading = false;
        state.taskStatusChart = action.payload;
      })
      .addCase(fetchTaskStatusChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchMonthlyTrends
      .addCase(fetchMonthlyTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyTrends = action.payload;
      })
      .addCase(fetchMonthlyTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
