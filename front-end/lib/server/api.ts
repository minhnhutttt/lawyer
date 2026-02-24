import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {ApiResponse} from '@/lib/types';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.status, error);
    return Promise.reject(error);
  }
);

function normalize<T>(data: any): ApiResponse<T> {
  if (data && typeof data === 'object' && 'data' in data) {
    return {
      data: data.data,
      pagination: data.pagination,
    };
  }
  return {data};
}

export async function get<T>(
  endpoint: string,
  params?: Record<string, any>,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const response = await apiClient.get(endpoint, {
    ...config,
    params,
  });

  return normalize<T>(response.data);
}

export async function post<T>(
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const response = await apiClient.post(endpoint, data, config);
  return normalize<T>(response.data);
}

export async function put<T>(
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const response = await apiClient.put(endpoint, data, config);
  return normalize<T>(response.data);
}

export async function del<T>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  const response = await apiClient.delete(endpoint, config);
  return normalize<T>(response.data);
}