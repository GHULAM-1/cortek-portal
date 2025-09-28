import { CreateUserRequest, CreateUserResponse, UpdateUserRequest, User } from '@/types/users/users-types';
import axiosInstance from '@/lib/axios-instance';

// Get All Users
export async function getAllUsers(): Promise<User[]> {
  const response = await axiosInstance.get<User[]>('/users');
  return response.data;
}

// Get User by ID
export async function getUserById(id: string): Promise<User> {
  const response = await axiosInstance.get<User>(`/users/${id}`);
  return response.data;
}

// Create User
export async function createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
  const response = await axiosInstance.post<CreateUserResponse>('/users', data);
  return response.data;
}

// Update User
export async function updateUser(id: string, data: UpdateUserRequest): Promise<{ message: string; user: User }> {
  const response = await axiosInstance.patch<{ message: string; user: User }>(`/users/${id}`, data);
  return response.data;
}

// Delete User
export async function deleteUser(id: string): Promise<{ message: string }> {
  const response = await axiosInstance.delete<{ message: string }>(`/users/${id}`);
  return response.data;
}