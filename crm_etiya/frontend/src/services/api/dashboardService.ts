import api from './axios';

export interface DashboardStats {
  totalCustomers: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
}

export interface UserStats {
  assignedTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
}

export interface AdminStats extends DashboardStats {
  totalUsers: number;
  activeUsers: number;
  activeCustomers: number;
  overdueTasks: number;
}

export interface TaskStatusChart {
  pending: number;
  inProgress: number;
  completed: number;
}

export interface MonthlyTrends {
  labels: string[];
  completed: number[];
  created: number[];
}

const dashboardService = {
  // Genel dashboard istatistikleri
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Kullanıcıya özel istatistikler
  getUserStats: async (): Promise<UserStats> => {
    const response = await api.get('/dashboard/stats/user');
    return response.data;
  },

  // Admin istatistikleri
  getAdminStats: async (): Promise<AdminStats> => {
    const response = await api.get('/dashboard/stats/admin');
    return response.data;
  },

  // Görev durum grafiği
  getTaskStatusChart: async (): Promise<TaskStatusChart> => {
    const response = await api.get('/dashboard/chart/task-status');
    return response.data;
  },

  // Aylık trend grafiği
  getMonthlyTrends: async (): Promise<MonthlyTrends> => {
    const response = await api.get('/dashboard/chart/monthly-trends');
    return response.data;
  },
};

export default dashboardService;
