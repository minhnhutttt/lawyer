'use client'

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

import { ApiResponse, ApiErrorResponse } from './types/api'
import { handleApiError } from './utils'

// Define base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Get the token from cookies or localStorage
    const token = (typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null)
    
    // If token exists, add authentication header
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // The API wrapper should extract the data property from the response
    // but also preserve pagination and meta information when available
    const responseData = response.data
    
    // If the response is an object with a 'data' property, preserve the structure
    // but also add pagination and meta information if available
    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
      const extractedData: ApiResponse<any> = {
        data: responseData.data
      }
      
      // Add pagination info if available
      if (responseData.pagination) {
        extractedData.pagination = responseData.pagination
      }

      // Return the modified response with our extracted data
      response.data = extractedData
      return response
    }
    
    // If the response doesn't have a 'data' property, return it as is
    // wrapped in a data property to maintain consistency
    response.data = {
      data: responseData
    }
    return response
  },
  (error: AxiosError<ApiErrorResponse>) => {
    // Check for specific error codes from the backend
    const errorCode = error.response?.data?.code
    
    // Handle authentication errors (redirect to login)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        
        // Redirect to login page unless already there
        if (!window.location.pathname.includes('/auth/login')) {
          window.location.href = '/auth/login'
        }
      }
    }
    // Handle other error codes
    return Promise.reject(handleApiError(error))
  }
)

// Generic GET request
export const get = async <T>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await api.get(url, { ...config, params })
  return response.data as ApiResponse<T>
}

// Generic POST request
export const post = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await api.post(url, data, config)
  return response.data as ApiResponse<T>
}

// Generic PUT request
export const put = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await api.put(url, data, config)
  return response.data as ApiResponse<T>
}

// Generic PATCH request
export const patch = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await api.patch(url, data, config)
  return response.data as ApiResponse<T>
}

// Generic DELETE request
export const del = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await api.delete(url, config)
  return response.data as ApiResponse<T>
}

export default api 