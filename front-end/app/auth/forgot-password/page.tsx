'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { FiMail, FiArrowLeft } from 'react-icons/fi'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Create a function to generate the Zod schema with translations
const createForgotPasswordSchema = (t: Function) => z.object({
  email: z.string()
    .min(1, { message: t('validation.email.required', 'Email is required') })
    .email({ message: t('validation.email.invalid', 'Please enter a valid email address') })
})

// Define the forgot password form data type
interface ForgotPasswordFormData {
  email: string
}

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Create the form schema with translations
  const forgotPasswordSchema = createForgotPasswordSchema(t)

  // Set up form with validation
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.post<any>('/auth/forgot-password', { email: data.email })

      if (response.data) {
        setSuccess(true)
      }
    } catch (error: any) {
      setError(error?.error || error?.message || t('auth.resetPasswordError'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">{t('auth.forgotPasswordTitle')}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.forgotPasswordSubtitle')}
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
                {t('auth.resetPasswordEmailSent')}
              </div>
              <p className="text-gray-600">
                {t('auth.checkYourEmail')}
              </p>
              <Link 
                href="/auth/login" 
                className="inline-flex items-center mt-4 text-primary hover:text-primary-dark font-medium transition-colors"
              >
                <div className="mr-2">
                  <FiArrowLeft />
                </div>
                {t('auth.backToLogin')}
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="text-gray-400">
                      <FiMail />
                    </div>
                  </div>
                  <input
                    className={`w-full pl-10 pr-4 py-3 rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition-colors`}
                    id="email"
                    placeholder={t('auth.emailPlaceholder')}
                    disabled={isLoading}
                    autoComplete="email"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message?.toString()}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  {t('auth.resetInstructions')}
                </p>
              </div>
              
              <Button
                variant="primary"
                className="w-full py-3 px-4"
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
              >
                {isLoading ? t('auth.sendingResetLink') : t('auth.sendResetLink')}
              </Button>
            </form>
          )}
          
          {!success && (
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {t('auth.rememberedPassword')}{" "}
                <Link href="/auth/login" className="text-primary hover:text-primary-dark font-medium transition-colors">
                  {t('auth.signIn')}
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 