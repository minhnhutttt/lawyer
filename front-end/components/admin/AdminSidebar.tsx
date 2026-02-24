'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { 
  FiGrid, 
  FiUsers, 
  FiUserCheck, 
  FiStar, 
  FiCalendar, 
  FiHelpCircle, 
  FiChevronLeft,
  FiChevronRight,
  FiX
} from 'react-icons/fi'

const menuItems = [
  { href: '/admin', icon: FiGrid, label: 'dashboard' },
  { href: '/admin/users', icon: FiUsers, label: 'user.management' },
  { href: '/admin/lawyers', icon: FiUserCheck, label: 'lawyer.management' },
  { href: '/admin/reviews', icon: FiStar, label: 'review.management' },
  { href: '/admin/appointments', icon: FiCalendar, label: 'appointment.management' },
  // { href: '/admin/articles', icon: FiFileText, label: 'article.management' },
  { href: '/admin/questions', icon: FiHelpCircle, label: 'q&a.management' },
  // { href: '/admin/settings', icon: FiSettings, label: 'settings' },
]

export default function AdminSidebar() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const sidebarRef = useRef<HTMLElement>(null)

  // Effect for handling clicks outside the sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMobileOpen(false);
      }
    };

    // Effect for handling the toggle sidebar event from AdminHeader
    const handleToggleSidebar = () => {
      setIsMobileOpen(prev => !prev);
    };

    // Listen for clicks to close the sidebar
    document.addEventListener('mousedown', handleClickOutside);
    // Listen for the custom event from the header
    window.addEventListener('toggle-admin-sidebar', handleToggleSidebar);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('toggle-admin-sidebar', handleToggleSidebar);
    };
  }, [isMobileOpen]);

  // Effect to close sidebar on navigation on mobile
  useEffect(() => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  }, [pathname]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
          aria-hidden="true"
        />
      )}
      
      <aside 
        ref={sidebarRef}
        className={`bg-white shadow-lg transition-all duration-300 fixed md:static 
          ${isCollapsed ? 'w-20 min-w-[5rem]' : 'w-64 min-w-[16rem]'} 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
          z-30 h-screen md:h-auto top-0 md:top-0 left-0 md:flex md:flex-col
        `}
      >
        <div className="flex flex-col h-full min-h-0 relative pt-16 md:pt-0">
          {/* Mobile close button */}
          <Button
            variant="ghost"
            onClick={() => setIsMobileOpen(false)}
            className="p-4 hover:bg-gray-100 flex justify-end rounded-none md:hidden absolute right-0 top-0"
            aria-label="Close sidebar"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </Button>
          
          {/* Desktop toggle button */}
          <Button
            variant="ghost"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-4 hover:bg-gray-100 flex justify-end rounded-none hidden md:flex"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <FiChevronRight className="w-5 h-5 text-gray-500" />
            ) : (
              <FiChevronLeft className="w-5 h-5 text-gray-500" />
            )}
          </Button>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 pb-20 md:pb-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-primary text-white' 
                          : 'text-gray-600 hover:bg-primary/5 hover:text-primary'
                      }`}
                      title={isCollapsed ? t(`admin.menu.${item.label}`) : undefined}
                    >
                      <Icon className="w-5 h-5" />
                      {!isCollapsed && (
                        <span className="ml-3">{t(`admin.menu.${item.label}`)}</span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  )
}