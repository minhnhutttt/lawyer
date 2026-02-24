'use client'

import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import Link from 'next/link'
import { FiLogOut, FiHome, FiMenu } from 'react-icons/fi'
import LanguageSelector from '@/components/layout/LanguageSelector'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { getFullName } from "@/lib/types"
import { useCallback } from 'react'

export default function AdminHeader({ showLanguageSelector = true }: { showLanguageSelector?: boolean } = {}) {
  const { t } = useTranslation()
  const { logout, user } = useAuthStore()
  
  // Create a global event for toggling the sidebar
  const toggleSidebar = useCallback(() => {
    const event = new CustomEvent('toggle-admin-sidebar')
    window.dispatchEvent(event)
  }, [])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="flex justify-between items-center h-20 px-2 md:px-8">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          onClick={toggleSidebar}
          className="md:hidden flex items-center text-gray-600 p-0 mr-2"
          aria-label="Toggle menu"
        >
          <FiMenu className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center flex-1 justify-center sm:justify-start">
          <Image 
            src="/images/admin-logo.png" 
            alt="Admin Logo"
            width={220}
            height={70}
            className="hidden sm:block h-12"
          />
          <Image 
            src="/images/admin-logo.png" 
            alt="Admin Logo" 
            width={150} 
            height={44} 
            className="object-contain sm:hidden mx-auto" 
          />
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-primary"
            title={t('common.home')}
          >
            <FiHome className="w-5 h-5" />
            <span className="ml-1 text-sm hidden md:inline">{t('common.home')}</span>
          </Link>

          {showLanguageSelector && <LanguageSelector />}
          <div className="hidden md:flex items-center text-gray-600">
            {t('admin.greeting', { name: user && getFullName(user) })}
          </div>

          <Button
            variant="ghost"
            onClick={logout}
            className="flex items-center text-gray-600 hover:text-primary p-0"
            title={t('auth.logout')}
          >
            <FiLogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}