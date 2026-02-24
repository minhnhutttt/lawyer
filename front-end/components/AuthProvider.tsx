'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'
import Cookies from 'js-cookie'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { getMe, isAuthenticated, token } = useAuthStore()

  useEffect(() => {
    // Check for authentication information in cookies and validate it
    if (typeof window !== 'undefined') {
      // If we have an authentication state in the store, verify it with the server
      if (isAuthenticated && token) {
        getMe().catch(() => {
          // Silent error handling for auth verification
        });
      }
    }
  }, [getMe, isAuthenticated, token]);

  return <>{children}</>
} 