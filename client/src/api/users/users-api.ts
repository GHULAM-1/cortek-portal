import { CreateUserRequest, CreateUserResponse, UpdateUserRequest, User } from '@/types/users/users-types';
import { api, publicApi } from '@/lib/api-wrapper';

  // Create User
  export async function createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    return await api.post<CreateUserResponse>('/users', data);
  }

  // Get All Users
  export async function getAllUsers(): Promise<User[]> {
    return await api.get<User[]>('/users');
  }

  // Get User by ID
  export async function getUserById(id: string): Promise<User> {
    return await api.get<User>(`/users/${id}`);
  }

  // Update User
  export async function updateUser(id: string, data: UpdateUserRequest): Promise<{ message: string; user: User }> {
    return await api.patch<{ message: string; user: User }>(`/users/${id}`, data);
  }

  // Delete User
  export async function deleteUser(id: string): Promise<{ message: string }> {
    return await api.delete<{ message: string }>(`/users/${id}`);
  }