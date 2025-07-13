import apiClient from '../client';
import { User } from '@/lib/types/auth';
import { ApiResponse, PaginatedResponse } from '@/lib/types/api';

export interface GetAllUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
  isActive?: boolean;
  needPagination?: boolean;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  isActive?: boolean;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  phone?: string;
  isActive?: boolean;
}

export const adminUsersApi = {
  getAll: (params: GetAllUsersParams): Promise<ApiResponse<PaginatedResponse<User>>> =>
    apiClient.get('/admin/users', { params }),

  getById: (id: string): Promise<ApiResponse<User>> =>
    apiClient.get(`/admin/users/${id}`),

  create: (data: CreateUserData): Promise<ApiResponse<User>> =>
    apiClient.post('/admin/users', data),

  update: (id: string, data: UpdateUserData): Promise<ApiResponse<User>> =>
    apiClient.patch(`/admin/users/${id}`, data),

  delete: (id: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`/admin/users/${id}`),

  activate: (id: string): Promise<ApiResponse<User>> =>
    apiClient.patch(`/admin/users/${id}/activate`),

  deactivate: (id: string): Promise<ApiResponse<User>> =>
    apiClient.patch(`/admin/users/${id}/deactivate`),
};
