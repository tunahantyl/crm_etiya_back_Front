import api from './axios';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  customerId: number;
  customerName?: string;
  assignedUserId: number;
  assignedTo?: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  priority?: number;
  estimatedHours?: number;
  actualHours?: number;
  completedAt?: string;
}

interface TaskCreateRequest {
  title: string;
  description: string;
  customerId: number;
  assignedUserId: number;
  dueDate: string;
  priority?: number;
  estimatedHours?: number;
}

interface TaskUpdateRequest extends Partial<TaskCreateRequest> {
  status?: TaskStatus;
}

// Backend model
interface BackendTask {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  priority?: number;
  estimatedHours?: number;
  actualHours?: number;
  completedAt?: string;
  customer: { id: number; name?: string };
  assignedTo?: { id: number; fullName?: string };
}

// Backend list DTO (TaskListResponse)
interface BackendTaskListItem {
  id: number;
  title: string;
  status: TaskStatus;
  dueDate: string;
  customerName?: string;
  assignedUserName?: string;
}

function mapBackendTaskListItem(t: BackendTaskListItem): Task {
  return {
    id: t.id,
    title: t.title,
    description: '',
    status: t.status,
    customerId: 0,
    customerName: t.customerName,
    assignedUserId: 0,
    assignedTo: t.assignedUserName,
    dueDate: t.dueDate,
    createdAt: '',
    updatedAt: '',
  } as Task;
}

function mapBackendTask(t: BackendTask): Task {
  return {
    id: t.id,
    title: t.title,
    description: t.description,
    status: t.status,
    customerId: t.customer?.id,
    customerName: t.customer?.name,
    assignedUserId: t.assignedTo?.id ?? 0,
    assignedTo: t.assignedTo?.fullName,
    dueDate: t.dueDate,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    priority: t.priority,
    estimatedHours: t.estimatedHours,
    actualHours: t.actualHours,
    completedAt: t.completedAt,
  } as Task;
}

// Mock data
const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Müşteri Görüşmesi',
    description: 'Yeni teklif hakkında görüşme',
    status: 'PENDING',
    customerId: 1,
    customerName: 'Ahmet Yılmaz',
    assignedUserId: 1,
    assignedTo: 'Destek Ekibi',
    dueDate: '2024-02-15',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: 2,
    title: 'Sözleşme Hazırlama',
    description: 'Yeni dönem sözleşmesi hazırlanacak',
    status: 'IN_PROGRESS',
    customerId: 2,
    customerName: 'Ayşe Demir',
    assignedUserId: 2,
    assignedTo: 'Satış Ekibi',
    dueDate: '2024-02-20',
    createdAt: '2024-01-21',
    updatedAt: '2024-01-22'
  },
  {
    id: 3,
    title: 'Teknik Destek',
    description: 'Sistem entegrasyonu desteği',
    status: 'COMPLETED',
    customerId: 3,
    customerName: 'Mehmet Kaya',
    assignedUserId: 3,
    assignedTo: 'Teknik Ekip',
    dueDate: '2024-02-10',
    createdAt: '2024-01-19',
    updatedAt: '2024-01-23'
  }
];

export const taskService = {
  getAll: async (): Promise<Task[]> => {
    try {
      // Accept both Page<BackendTask> and List<BackendTaskListItem>
      const response = await api.get('/tasks', { params: { page: 0, size: 500, sort: 'createdAt,desc' } });
      const data: any = response.data;

      if (Array.isArray(data)) {
        // List<TaskListResponse>
        return (data as BackendTaskListItem[]).map(mapBackendTaskListItem);
      }

      if (data && Array.isArray(data.content)) {
        // Page<BackendTask>
        return (data.content as BackendTask[]).map(mapBackendTask);
      }

      return [];
    } catch (error) {
      console.error('Task getAll API error:', error);
      // Fallback: boş liste döndür (duplikasyon olmasın)
      return [];
    }
  },

  getById: async (id: number): Promise<Task> => {
    try {
      const response = await api.get<BackendTask>(`/tasks/${id}`);
      return mapBackendTask(response.data);
    } catch (error) {
      console.error('Task getById API error:', error);
      // Fallback to mock data on error
      await new Promise(resolve => setTimeout(resolve, 500));
      const task = mockTasks.find(t => t.id === id);
      if (!task) {
        throw new Error('Task not found');
      }
      return task;
    }
  },

  create: async (data: TaskCreateRequest): Promise<Task> => {
    try {
      // Backend DTO'su: TaskCreateRequest
      const dto = {
        title: data.title,
        description: data.description,
        customerId: data.customerId,
        assignedUserId: data.assignedUserId,
        dueDate: new Date(data.dueDate).toISOString(),
        priority: data.priority || 0,
        estimatedHours: data.estimatedHours,
      };
      const response = await api.post<BackendTask>('/tasks', dto);
      return mapBackendTask(response.data);
    } catch (error) {
      console.error('Task create API error:', error);
      // Fallback to mock data on error
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newTask: Task = {
        id: Math.max(...mockTasks.map(t => t.id)) + 1,
        ...data,
        status: 'PENDING',
        customerName: 'Mock Customer',
        assignedTo: 'Mock User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockTasks.push(newTask);
      return newTask;
    }
  },

  update: async (id: number, data: TaskUpdateRequest): Promise<Task> => {
    try {
      const formattedData = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined
      };
      const response = await api.put<Task>(`/tasks/${id}`, formattedData);
      return response.data;
    } catch (error) {
      console.error('Task update API error:', error);
      // Fallback to mock data on error
      await new Promise(resolve => setTimeout(resolve, 1000));
      const index = mockTasks.findIndex(t => t.id === id);
      if (index === -1) {
        throw new Error('Task not found');
      }
      const updatedTask = {
        ...mockTasks[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      mockTasks[index] = updatedTask;
      return updatedTask;
    }
  },

  updateStatus: async (id: number, status: TaskStatus): Promise<Task> => {
    const response = await api.put<BackendTask>(`/tasks/${id}/status`, null, { params: { status } });
    return mapBackendTask(response.data);
  },

  getByCustomerId: async (customerId: number): Promise<Task[]> => {
    // Backend hazır olduğunda:
    // const response = await api.get<Task[]>(`/tasks?customerId=${customerId}`);
    // return response.data;

    // Mock response
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockTasks.filter(t => t.customerId === customerId);
  },

  getByAssignedUserId: async (userId: string): Promise<Task[]> => {
    const response = await api.get<BackendTask[]>(`/tasks/assigned/${userId}`);
    return response.data.map(mapBackendTask);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  }
};