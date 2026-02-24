'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { FiLock, FiArrowLeft } from 'react-icons/fi'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ResetPasswordRequest } from '@/lib/types/auth'

// Create a function to generate the Zod schema with translations
const createResetPasswordSchema = (t: Function) => z.object({
  password: z.string()
    .min(1, { message: t('validation.password.required', 'Password is required') })
    .min(8, { message: t('validation.password.minLength', 'Password must be at least 8 characters') }),
  confirmPassword: z.string()
    .min(1, { message: t('validation.confirmPassword.required', 'Confirm password is required') })
})
.refine((data) => data.password === data.confirmPassword, {
  message: t('validation.confirmPassword.mismatch', 'Passwords do not match'),
  path: ['confirmPassword']
})

// Define the reset password form data type
interface ResetPasswordFormData {
  password: string
  confirmPassword: string
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Get the token from the URL
  const token = searchParams?.get('token')
  
  // Create the form schema with translations
  const resetPasswordSchema = createResetPasswordSchema(t)
  
  // Set up form with validation
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  // Form submission handler
  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError(t('auth.invalidOrExpiredToken'))
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const resetData: ResetPasswordRequest = {
        token,
        password: data.password
      }
      
      const response = await api.post<any>('/auth/reset-password', resetData)
      
      if (response.data) {
        setSuccess(true)
      }
    } catch (error: any) {
      console.error(error)
      setError(error?.error || error?.message || t('auth.resetPasswordError'))
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">{t('auth.resetPasswordTitle')}</h1>
          </div>
          
          <div className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200 mb-6">
              {t('auth.invalidOrExpiredToken')}
            </div>
            <div className="text-center">
              <Link 
                href="/auth/forgot-password" 
                className="inline-flex items-center mt-4 text-primary hover:text-primary-dark font-medium transition-colors"
              >
                <div className="mr-2">
                  <FiArrowLeft />
                </div>
                {t('auth.requestNewResetLink')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">{t('auth.resetPasswordTitle')}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.resetPasswordSubtitle')}
          </p>
        </div>
      
        <div className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}
          
          {success ? (
            <div className="text-center space-y-6">
              <div className="rounded-md bg-green-50 p-4 text-sm text-green-700 border border-green-200 mb-6">
                {t('auth.passwordResetSuccess')}
              </div>
              <p className="text-gray-600">
                {t('auth.canNowLogin')}
              </p>
              <Link 
                href="/auth/login" 
                className="inline-flex items-center mt-4 text-primary hover:text-primary-dark font-medium transition-colors"
              >
                <div className="mr-2">
                  <FiArrowLeft />
                </div>
                {t('auth.proceedToLogin')}
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                  {t('auth.newPassword')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="text-gray-400">
                      <FiLock />
                    </div>
                  </div>
                  <input
                    className={`w-full pl-10 pr-4 py-3 rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition-colors`}
                    id="password"
                    type="password"
                    placeholder={t('auth.newPasswordPlaceholder')}
                    disabled={isLoading}
                    autoComplete="new-password"
                    {...register('password')}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message?.toString()}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                  {t('auth.confirmPassword')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="text-gray-400">
                      <FiLock />
                    </div>
                  </div>
                  <input
                    className={`w-full pl-10 pr-4 py-3 rounded-md border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition-colors`}
                    id="confirmPassword"
                    type="password"
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    disabled={isLoading}
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message?.toString()}
                  </p>
                )}
              </div>
              
              <Button
                variant="primary"
                className="w-full py-3 px-4"
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
              >
                {isLoading ? t('auth.resettingPassword') : t('auth.resetPassword')}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}