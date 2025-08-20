import api from './axios';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  isActive: boolean;
}

interface CustomerCreateRequest {
  name: string;
  email: string;
  phone: string;
}

interface CustomerUpdateRequest extends CustomerCreateRequest {
  isActive: boolean;
}

export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    // Page<Customer> dönüyor; content'i alalım (ilk 100 kayıt için)
    const response = await api.get('/customers', { params: { page: 0, size: 100 } });
    // Spring Page response: { content, totalElements, ... }
    return response.data.content as Customer[];
  },

  getById: async (id: number): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  create: async (data: CustomerCreateRequest): Promise<Customer> => {
    const response = await api.post<Customer>('/customers', data);
    return response.data;
  },

  update: async (id: number, data: CustomerUpdateRequest): Promise<Customer> => {
    const response = await api.put<Customer>(`/customers/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/customers/${id}`);
  }
};