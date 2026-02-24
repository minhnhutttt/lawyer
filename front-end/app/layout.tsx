'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Toaster, toast } from 'react-hot-toast'
import { useAuthStore } from '@/store/auth-store'
import '@/styles/globals.css'
import { Noto_Sans } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import TranslationProvider from '@/components/TranslationProvider'
import AuthProvider from '@/components/AuthProvider'
import { getPageTitle } from '@/lib/utils/pageTitle'

// Initialize Noto Sans font
const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans',
})

function RootLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { t } = useTranslation()
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    const error = searchParams?.get('error')
    if (error === 'forbidden') {
      toast.error(t('errors.forbidden'))
    }
  }, [searchParams, t])

  // Don't apply main layout to admin routes
  if (pathname?.startsWith('/admin')) {
    return (
      <TranslationProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </TranslationProvider>
    )
  }

  return (
    <TranslationProvider>
      <AuthProvider>
        <Header showLanguageSelector={false} />
        <main className="flex-grow">
          <div className="">
            {children}
          </div>
        </main>
        <Footer />
      </AuthProvider>
    </TranslationProvider>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const pageTitleSuffix = getPageTitle(pathname)
  const fullTitle = `べんごしっち｜${pageTitleSuffix}`

  return (
    <html lang="en" className={notoSans.className}>
      <head>
        <title>{fullTitle}</title>
        <meta name="description" content="法律の専門家とつながる" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Add Open Graph meta tags */}
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content="法律の専門家とつながる" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://stg.bengoshicchi.jp/images/logo.png"
        />
        <meta property="og:site_name" content={fullTitle} />
        <meta property="og:locale" content="ja_JP" />
        <meta property="og:locale:alternate" content="en_US" />
        {/* Facebook SDK will be loaded client-side only */}
      </head>
      <body className="flex min-h-screen flex-col">
        <Suspense fallback={null}>
          <RootLayoutContent>{children}</RootLayoutContent>
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}