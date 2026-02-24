'use client'

import { toast, ToastOptions } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

// Default toast options
const defaultOptions: ToastOptions = {
  duration: 3000,
  position: 'top-right',
}

// Success toast options
const successOptions: ToastOptions = {
  ...defaultOptions,
  style: {
    background: '#10B981',
    color: '#FFFFFF',
  },
  icon: '✓',
}

// Error toast options
const errorOptions: ToastOptions = {
  ...defaultOptions,
  style: {
    background: '#EF4444',
    color: '#FFFFFF',
  },
  icon: '✕',
}

// Warning toast options
const warningOptions: ToastOptions = {
  ...defaultOptions,
  style: {
    background: '#F59E0B',
    color: '#FFFFFF',
  },
  icon: '⚠',
}

// Info toast options
const infoOptions: ToastOptions = {
  ...defaultOptions,
  style: {
    background: '#3B82F6',
    color: '#FFFFFF',
  },
  icon: 'ℹ',
}

export const useToast = () => {
  const { t } = useTranslation()

  const showToast = ({ message, type = 'info', duration }: ToastProps) => {
    const options = {
      ...(type === 'success' ? successOptions :
         type === 'error' ? errorOptions :
         type === 'warning' ? warningOptions :
         infoOptions),
      duration: duration || defaultOptions.duration,
    }

    let errorCode = message

    // Handle authentication errors (redirect to login)
    if (type === 'error') {
      errorCode = `errors.errorCodes.${message}`
    }

    // Translate the message if it's a translation key
    const translatedMessage = t(errorCode, { defaultValue: message });
    
    return toast(translatedMessage, options)
  }

  return {
    success: (message: string, duration?: number) => 
      showToast({ message, type: 'success', duration }),
    error: (message: string, duration?: number) => 
      showToast({ message, type: 'error', duration }),
    warning: (message: string, duration?: number) => 
      showToast({ message, type: 'warning', duration }),
    info: (message: string, duration?: number) => 
      showToast({ message, type: 'info', duration }),
  }
} 