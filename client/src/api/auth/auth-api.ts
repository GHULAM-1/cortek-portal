import { LoginResponse } from '@/types/users/users-types';
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Create a separate axios instance for public auth routes
const publicAxios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Login user
export async function loginUser(data: { email: string; password: string }): Promise<LoginResponse> {
  const response = await publicAxios.post<LoginResponse>('/users/login', data);
  return response.data;
}