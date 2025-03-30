import { API_BASE_URL, getAuthHeader, ApiResponse } from './apiConfig';

export interface RequestOptions extends RequestInit {
  token?: string | null;
}

async function request<T>(
  endpoint: string,
  { token = null, ...customConfig }: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(token),
    ...customConfig.headers,
  };

  const config = {
    ...customConfig,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || 'An error occurred' };
    }

    return { data };
  } catch (error) {
    return { error: 'Network error occurred' };
  }
}

export function get<T>(endpoint: string, options?: RequestOptions) {
  return request<T>(endpoint, { ...options, method: 'GET' });
}

export function post<T>(endpoint: string, data: any, options?: RequestOptions) {
  return request<T>(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function put<T>(endpoint: string, data: any, options?: RequestOptions) {
  return request<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function del<T>(endpoint: string, options?: RequestOptions) {
  return request<T>(endpoint, { ...options, method: 'DELETE' });
} 