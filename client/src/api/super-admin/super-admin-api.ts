import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Base Types
export type SuperadminProfile = {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type LoginRequest = Pick<SuperadminProfile, 'email'> & {
  password: string;
};

export type LoginResponse = {
  message: string;
  superadmin: SuperadminProfile;
};

export type UpdateProfileRequest = Partial<Omit<SuperadminProfile, 'id' | 'created_at' | 'updated_at'>> & {
  password?: string;
};

export type UpdateProfileResponse = {
  message: string;
  superadmin: SuperadminProfile;
};

// API Methods
export const superAdminApi = {
  // Login
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post('/superadmin/login', data);
    return response.data;
  },

  // Signout
  async signout(): Promise<{ message: string }> {
    const response = await apiClient.post('/superadmin/signout');
    return response.data;
  },

  // Get Profile
  async getProfile(): Promise<SuperadminProfile> {
    const response = await apiClient.get('/superadmin/profile');
    return response.data;
  },

  // Update Profile
  async updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const response = await apiClient.patch('/superadmin/profile', data);
    return response.data;
  },
};