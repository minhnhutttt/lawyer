// Server-side translation utility
import { cookies, headers } from 'next/headers'

// English
import enCommon from '@/locales/en/common.json'
import enArticles from '@/locales/en/articles.json'

// Japanese
import jaCommon from '@/locales/ja/common.json'
import jaArticles from '@/locales/ja/articles.json'

const resources = {
  en: {
    common: enCommon,
    articles: enArticles,
  },
  ja: {
    common: jaCommon,
    articles: jaArticles,
  }
}

/**
 * Get the current locale from cookies or headers
 */
export function getLocale(): string {
  // Try to get locale from cookies
  const cookieStore = cookies()
  const localeCookie = cookieStore.get("i18next");
  
  if (localeCookie?.value) {
    return localeCookie.value
  }
  
  // Try to get locale from Accept-Language header
  const headersList = headers()
  const acceptLanguage = headersList.get('Accept-Language')
  
  if (acceptLanguage) {
    // Simple parsing of Accept-Language header
    const languages = acceptLanguage.split(',')
    const primaryLang = languages[0].split(';')[0].trim().substring(0, 2)
    
    if (primaryLang === 'ja' || primaryLang === 'en') {
      return primaryLang
    }
  }
  
  // Default fallback
  return 'ja'
}

/**
 * Server-side translation function
 */
export function getTranslations() {
  const locale = getLocale()
  const translations = resources[locale as 'en' | 'ja'] || {}
  
  return {
    t: (key: string, options?: { [key: string]: any }): string => {
      // Split the key by dots to access nested properties
      const keys = key.split('.')
      let value: any = translations
      console.log(value);
      console.log(keys);
      // Navigate through the nested structure
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k]
        } else {
          // If key not found, return the key itself
          return key
        }
      }
      
      // If value is not a string, return the key
      if (typeof value !== 'string') {
        return key
      }
      
      // Handle simple interpolation if options are provided
      if (options) {
        return Object.entries(options).reduce((acc: string, [k, v]) => {
          return acc.replace(new RegExp(`{{${k}}}`, 'g'), String(v))
        }, value)
      }
      
      return value
    }
  }
}
