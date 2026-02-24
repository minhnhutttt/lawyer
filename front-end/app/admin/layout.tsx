'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { Toaster } from 'react-hot-toast'
import { Noto_Sans } from 'next/font/google'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

// Initialize Noto Sans font
const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans',
})

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!isAuthenticated || user?.role !== 'admin') {
      if (pathname !== '/auth/login') {
        router.push('/auth/login?from=/admin')
      }
    }
  }, [isAuthenticated, user, router, pathname])

  if (!isAuthenticated || user?.role !== 'admin') {
    return null
  }

  return (
    <div className={`min-h-screen flex flex-col bg-gray-100 ${notoSans.className}`}>
      <AdminHeader showLanguageSelector={false} />
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  )
}