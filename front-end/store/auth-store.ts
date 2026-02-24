'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import api from '@/lib/api'
import Cookies from 'js-cookie'
import { ApiResponse } from '@/lib/types/api'
import {User} from "@/lib/types";

// Cookie storage implementation for Zustand
const cookieStorage = {
  getItem: (name: string) => {
    const cookieValue = Cookies.get(name);
    return cookieValue ? Promise.resolve(cookieValue) : Promise.resolve(null);
  },
  setItem: (name: string, value: string) => {
    // Set the cookie to expire in 7 days and be available across the site
    Cookies.set(name, value, { expires: 7, path: '/' });
    return Promise.resolve();
  },
  removeItem: (name: string) => {
    Cookies.remove(name, { path: '/' });
    return Promise.resolve();
  },
};

interface RegisterRequest {
  email: string
  password: string
  role: 'client' | 'lawyer' | 'admin'
  nickname: string
  lawyer_profile?: {
    email?: string
    full_name?: string
    first_name?: string
    last_name?: string
    date_of_birth?: string
    gender?: string
    affiliation?: string
    registration_number?: string
  }
}

interface TokenResponse {
  token: string
  user: User
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  error_code: string | null
  
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterRequest) => Promise<boolean>
  logout: () => Promise<void>
  clearError: () => void
  getMe: () => Promise<void>
  checkAuth: () => Promise<void>
  getRedirectPath: (from?: string) => string
  updateUserData: (userData: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      error_code: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        
        try {
          const { data } = await api.post<ApiResponse<TokenResponse>>('/auth/login', {
            email,
            password,
          })
          
          // Ensure we have all the data before setting state
          if (!data?.data?.token || !data?.data?.user) {
            throw new Error('Invalid server response: missing token or user data');
          }
          
          // Update state with user data and token
          set({
            user: data.data.user,
            token: data.data.token,
            isAuthenticated: true,
            isLoading: false
          })
          
          // Also store token directly in localStorage for the API client
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth-token', data.data.token);
          }
          
          return true;
        } catch (error: any) {
          set({
            isLoading: false,
            error: !!error.message ? error.message : 'An unknown error occurred',
            error_code: error.code
          })
          throw error;
        }
      },
      
      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null })
        
        try {
          const response = await api.post<
            ApiResponse<{ id: string; message: string }>
          >("/auth/register", data);
          
          // Set isLoading to false on success
          set({ isLoading: false })
          return response.status === 201;
        } catch (error: any) {
          set({
            isLoading: false,
            error_code: error.code,
            error: !!error.message ? error.message : 'An unknown error occurred'
          })
          throw error;
        }
      },
      
      logout: async () => {
        set({ isLoading: true })
        try {
          await api.post<ApiResponse<{ message: string }>>('/auth/logout', {})
        } catch (error) {
          // Silent error handling for logout
        } finally {
          // Clear auth state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          })
          
          // Clear token from localStorage as well
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-token');
            
            // Force reload to ensure all page components update
            window.location.href = '/'
          }
        }
      },
      
      getMe: async () => {
        // Skip if not authenticated or already loading
        if (!get().isAuthenticated || get().isLoading) return;
        
        set({ isLoading: true, error: null });
        
        try {
          const response = await api.get<ApiResponse<User>>('/auth/me');
          set({ 
            user: response.data.data,
            isLoading: false,
            isAuthenticated: true
          });
        } catch (error: any) {
          // If unauthorized, clear auth state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error_code: error.code,
            error: !!error.message ? error.message : 'Failed to fetch user data'
          });
        }
      },
      
      clearError: () => set({ error: null }),

      checkAuth: async () => {
        const token = localStorage.getItem('auth-token')
        if (!token) {
          set({ user: null, token: null, isAuthenticated: false })
          return
        }

        try {
          const { data } = await api.get<ApiResponse<User>>('/auth/me')
          set({ user: data.data, token, isAuthenticated: true })
        } catch (error: any) {
          localStorage.removeItem('auth-token')
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error_code: error.code,
            error: !!error.message
              ? error.message
              : "Failed to fetch user data",
          });
        }
      },

      getRedirectPath: (from: string = '/') => {
        const { user } = get()
        if (!user) return '/';
        return user.role === 'admin' ? '/admin' : from 
      },
      
      updateUserData: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;
        
        set({
          user: {
            ...currentUser,
            ...userData
          }
        });
      }
    }),
    {
      name: 'lawyer-platform-auth',
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
) 