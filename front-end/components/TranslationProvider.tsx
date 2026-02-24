'use client'

import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'

// Pre-load all namespaces
const namespaces = ['common', 'auth', 'questions', 'lawyers', 'appointments', 'errors']

export default function TranslationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load all namespaces
    Promise.all(namespaces.map(ns => i18n.loadNamespaces(ns)))
    setMounted(true)
  }, [])

  // To avoid hydration mismatch, only render when client-side
  if (!mounted) {
    return null
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
} 