export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAuthHeader = (token: string | null): Record<string, string> => {
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface ApiResponse<T> {
  data?: T;
  error?: string;
} 