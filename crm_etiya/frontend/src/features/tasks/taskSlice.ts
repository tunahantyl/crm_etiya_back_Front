import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskService, type Task, type TaskStatus } from '../../services/api/taskService';

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const tasks = await taskService.getAll();
      return tasks;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Görevler yüklenemedi');
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const task = await taskService.getById(id);
      return task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Görev bulunamadı');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (data: {
    title: string;
    description: string;
    customerId: number;
    assignedUserId: number;
    dueDate: string | Date;
  }, { rejectWithValue }) => {
    try {
      const task = await taskService.create({
        ...data,
        dueDate: typeof data.dueDate === 'string' ? data.dueDate : (data.dueDate as Date).toISOString(),
      } as any);
      return task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Görev oluşturulamadı');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, data }: {
    id: number;
      data: {
      title?: string;
      description?: string;
      customerId?: number;
      assignedUserId?: number;
      dueDate?: string;
      status?: TaskStatus;
    };
  }, { rejectWithValue }) => {
    try {
      const task = await taskService.update(id, data);
      return task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Görev güncellenemedi');
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async ({ id, status }: { id: number; status: TaskStatus }, { rejectWithValue }) => {
    try {
      const task = await taskService.updateStatus(id, status);
      return task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Görev durumu güncellenemedi');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await taskService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Görev silinemedi');
    }
  }
);

export const fetchTasksByCustomer = createAsyncThunk(
  'tasks/fetchByCustomer',
  async (customerId: number, { rejectWithValue }) => {
    try {
      const tasks = await taskService.getByCustomerId(customerId);
      return tasks;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Müşteri görevleri yüklenemedi');
    }
  }
);

export const fetchTasksByUser = createAsyncThunk(
  'tasks/fetchByUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const tasks = await taskService.getByAssignedUserId(userId);
      return tasks;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Kullanıcı görevleri yüklenemedi');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasks = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch By Id
    builder.addCase(fetchTaskById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTaskById.fulfilled, (state, action) => {
      state.selectedTask = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchTaskById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create
    builder.addCase(createTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createTask.fulfilled, (state, action) => {
      state.tasks.push(action.payload);
      state.loading = false;
    });
    builder.addCase(createTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update
    builder.addCase(updateTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      state.selectedTask = action.payload;
      state.loading = false;
    });
    builder.addCase(updateTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Status
    builder.addCase(updateTaskStatus.fulfilled, (state, action) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      if (state.selectedTask?.id === action.payload.id) {
        state.selectedTask = action.payload;
      }
    });

    // Delete
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    });

    // Fetch By Customer
    builder.addCase(fetchTasksByCustomer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTasksByCustomer.fulfilled, (state, action) => {
      state.tasks = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchTasksByCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch By User
    builder.addCase(fetchTasksByUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTasksByUser.fulfilled, (state, action) => {
      state.tasks = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchTasksByUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, clearSelectedTask } = taskSlice.actions;

export default taskSlice.reducer;