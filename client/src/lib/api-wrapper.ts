import axios, { AxiosResponse } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let currentUser: any = null;

// Function to verify authentication and get current user
const verifyAuth = async () => {
  try {
    const response = await apiClient.get("/users/me");
    currentUser = response.data;

    // Persist user to localStorage for refresh persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }

    return currentUser;
  } catch (error: any) {
    currentUser = null;

    // Clear localStorage on auth failure
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser");
    }

    if (error.response?.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error("Authentication failed");
  }
};

// Helper function to handle API errors
const handleApiError = (error: any) => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  } else if (error.response?.data?.error) {
    throw new Error(error.response.data.error);
  } else if (error.message) {
    throw new Error(error.message);
  } else {
    throw new Error(`Request failed with status ${error.response?.status || 'unknown'}`);
  }
};

// Authenticated API wrapper
export const api = {
  // GET with auth check
  async get<T>(url: string): Promise<T> {
    try {
      await verifyAuth();
      const response: AxiosResponse<T> = await apiClient.get(url);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
      throw error; // This line won't be reached but keeps TypeScript happy
    }
  },

  // POST with auth check
  async post<T>(url: string, data?: any): Promise<T> {
    try {
      await verifyAuth();
      const response: AxiosResponse<T> = await apiClient.post(url, data);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
      throw error; // This line won't be reached but keeps TypeScript happy
    }
  },

  // PATCH with auth check
  async patch<T>(url: string, data?: any): Promise<T> {
    try {
      await verifyAuth();
      const response: AxiosResponse<T> = await apiClient.patch(url, data);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
      throw error; // This line won't be reached but keeps TypeScript happy
    }
  },

  // DELETE with auth check
  async delete<T>(url: string): Promise<T> {
    try {
      await verifyAuth();
      const response: AxiosResponse<T> = await apiClient.delete(url);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
      throw error; // This line won't be reached but keeps TypeScript happy
    }
  },

  // Get current authenticated user
  getCurrentUser() {
    // If no user in memory, try to restore from localStorage
    if (!currentUser && typeof window !== "undefined") {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        try {
          currentUser = JSON.parse(stored);
        } catch (error) {
          localStorage.removeItem("currentUser");
        }
      }
    }
    return currentUser;
  },

  // Clear cached user
  clearUser() {
    currentUser = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser");
    }
  },
};

// Public API (no auth check) for login/signup/public routes
export const publicApi = {
  async get<T>(url: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.get(url);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
      throw error; // This line won't be reached but keeps TypeScript happy
    }
  },

  async post<T>(url: string, data?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.post(url, data);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
      throw error; // This line won't be reached but keeps TypeScript happy
    }
  },

  async patch<T>(url: string, data?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.patch(url, data);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
      throw error; // This line won't be reached but keeps TypeScript happy
    }
  },

  async delete<T>(url: string, data?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.delete(url);
      return response.data;
    } catch (error: any) {
      handleApiError(error);
      throw error; // This line won't be reached but keeps TypeScript happy
    }
  },

  // Clear cached user
  clearUser() {
    currentUser = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser");
    }
  },
};
