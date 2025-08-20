import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customerService, type Customer } from '../../services/api/customerService';

interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchCustomers = createAsyncThunk(
  'customers/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const customers = await customerService.getAll();
      return customers;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Müşteriler yüklenemedi');
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const customer = await customerService.getById(id);
      return customer;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Müşteri bulunamadı');
    }
  }
);

export const createCustomer = createAsyncThunk(
  'customers/create',
  async (data: { name: string; email: string; phone: string }, { rejectWithValue }) => {
    try {
      const customer = await customerService.create(data);
      return customer;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Müşteri oluşturulamadı');
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/update',
  async ({ id, data }: { id: number; data: { name: string; email: string; phone: string; isActive: boolean } }, { rejectWithValue }) => {
    try {
      const customer = await customerService.update(id, data);
      return customer;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Müşteri güncellenemedi');
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await customerService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Müşteri silinemedi');
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All
    builder.addCase(fetchCustomers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCustomers.fulfilled, (state, action) => {
      state.customers = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchCustomers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch By Id
    builder.addCase(fetchCustomerById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCustomerById.fulfilled, (state, action) => {
      state.selectedCustomer = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchCustomerById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create
    builder.addCase(createCustomer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createCustomer.fulfilled, (state, action) => {
      state.customers.push(action.payload);
      state.loading = false;
    });
    builder.addCase(createCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update
    builder.addCase(updateCustomer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCustomer.fulfilled, (state, action) => {
      const index = state.customers.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
      state.selectedCustomer = action.payload;
      state.loading = false;
    });
    builder.addCase(updateCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete
    builder.addCase(deleteCustomer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteCustomer.fulfilled, (state, action) => {
      state.customers = state.customers.filter(c => c.id !== action.payload);
      state.loading = false;
    });
    builder.addCase(deleteCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, clearSelectedCustomer } = customerSlice.actions;

export default customerSlice.reducer;