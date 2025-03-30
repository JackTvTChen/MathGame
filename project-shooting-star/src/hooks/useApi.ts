import { useAuth } from '../context';
import * as api from '../utils/api';
import { ApiResponse } from '../utils/apiConfig';

interface UseApiReturn {
  get: <T>(endpoint: string) => Promise<ApiResponse<T>>;
  post: <T>(endpoint: string, data: any) => Promise<ApiResponse<T>>;
  put: <T>(endpoint: string, data: any) => Promise<ApiResponse<T>>;
  del: <T>(endpoint: string) => Promise<ApiResponse<T>>;
}

export const useApi = (): UseApiReturn => {
  const { state } = useAuth();
  const { token } = state;

  return {
    get: <T>(endpoint: string) => api.get<T>(endpoint, { token }),
    post: <T>(endpoint: string, data: any) => api.post<T>(endpoint, data, { token }),
    put: <T>(endpoint: string, data: any) => api.put<T>(endpoint, data, { token }),
    del: <T>(endpoint: string) => api.del<T>(endpoint, { token }),
  };
}; 