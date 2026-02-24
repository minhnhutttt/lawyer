'use client'

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function LanguageSelector({ className }: { className?: string }) {
  const { i18n, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('ja')
  const router = useRouter()

  useEffect(() => {
    changeLanguage(i18n.language || 'ja')
  }, [i18n.language])

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language)
    setCurrentLanguage(language)
    setIsOpen(false)
    router.refresh();
  }

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 p-2 text-gray-700"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm">{currentLanguage === 'en' ? 'EN' : 'JP'}</span>
      </Button>

      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-1 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="listbox"
        >
          <div className="px-3 py-2 text-xs font-semibold text-gray-500">
            {t('common.language')}
          </div>
          <Button
            variant={currentLanguage === 'en' ? 'primary' : 'ghost'}
            className={cn(
              'flex w-full items-center px-4 py-2 text-sm justify-start',
              currentLanguage === 'en' ? 'text-white' : 'text-gray-700'
            )}
            onClick={() => changeLanguage('en')}
            role="option"
            aria-selected={currentLanguage === 'en'}
          >
            <span className="mr-2 inline-block h-4 w-4 overflow-hidden rounded-full">
              🇺🇸
            </span>
            {t('common.english')}
          </Button>
          <Button
            variant={currentLanguage === 'ja' ? 'primary' : 'ghost'}
            className={cn(
              'flex w-full items-center px-4 py-2 text-sm justify-start',
              currentLanguage === 'ja' ? 'text-white' : 'text-gray-700'
            )}
            onClick={() => changeLanguage('ja')}
            role="option"
            aria-selected={currentLanguage === 'ja'}
          >
            <span className="mr-2 inline-block h-4 w-4 overflow-hidden rounded-full">
              🇯🇵
            </span>
            {t('common.japanese')}
          </Button>
        </div>
      )}
    </div>
  )
} 