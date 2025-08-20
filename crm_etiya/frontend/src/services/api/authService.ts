import api from './axios';
import type { User } from '../../features/auth/authSlice';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface BackendAuthResponse {
  token: string;
}

interface BackendUser {
  id: number;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'MANAGER' | 'USER';
}

interface AuthResponse {
  token: string;
  user: User;
}

function mapBackendUserToFrontendUser(u: BackendUser): User {
  return {
    id: String(u.id),
    email: u.email,
    name: u.fullName,
    role: u.role,
  };
}

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const loginResp = await api.post<BackendAuthResponse>('/auth/login', data);
    const token = loginResp.data.token;
    localStorage.setItem('token', token);
    const meResp = await api.get<BackendUser>('/users/me');
    return { token, user: mapBackendUserToFrontendUser(meResp.data) };
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const registerResp = await api.post<BackendAuthResponse>('/auth/register', data);
    const token = registerResp.data.token;
    localStorage.setItem('token', token);
    const meResp = await api.get<BackendUser>('/users/me');
    return { token, user: mapBackendUserToFrontendUser(meResp.data) };
  },

  changePassword: async (_data: ChangePasswordRequest): Promise<void> => {
    // Backend endpoint henüz yok; no-op
    return;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async (): Promise<User> => {
    const meResp = await api.get<BackendUser>('/users/me');
    return mapBackendUserToFrontendUser(meResp.data);
  }
};