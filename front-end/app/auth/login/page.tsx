'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { FiLock, FiMail } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Create a function to generate the Zod schema with translations
const createLoginSchema = (t: Function) => z.object({
  email: z.string()
    .min(1, { message: t('validation.email.required', 'Email is required') })
    .email({ message: t('validation.email.invalid', 'Please enter a valid email address') })
    .max(255, { message: t('validation.email.maxLength', 'Email cannot exceed 255 characters') }),
  password: z.string()
    .min(1, { message: t('validation.password.required', 'Password is required') }),
})

// Define the login form data type
interface LoginFormData {
  email: string
  password: string
}

export default function LoginPage() {
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const { login, isLoading, error, error_code, isAuthenticated, getRedirectPath } = useAuthStore()

  // Create the form schema with translations
  const loginSchema = createLoginSchema(t)

  // Set up form with validation
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  // Get the redirect path from URL params if available
  const from = searchParams?.get('from') || '/'

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Use window.location for full page reload
      window.location.href = getRedirectPath(from);
    }
  }, [isAuthenticated, from, getRedirectPath])

  // Form submission handler
  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data.email, data.password)
    if (success) {
      // Use window.location for full page reload
      window.location.href = getRedirectPath(from);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {t("auth.loginTitle")}
          </h1>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              <div dangerouslySetInnerHTML={{
                __html: t(`errors.errorCodes.${error_code}`, {
                  resend_link: "/auth/verify-email"
                })
              }} />
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                {t("auth.email")}
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div className="text-gray-400">
                    <FiMail />
                  </div>
                </div>
                <input
                  className={`w-full pl-10 pr-4 py-3 rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition-colors`}
                  id="email"
                  placeholder={t("auth.emailPlaceholder")}
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
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                {t("auth.password")}
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div className="text-gray-400">
                    <FiLock />
                  </div>
                </div>
                <input
                  className={`w-full pl-10 pr-4 py-3 rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition-colors`}
                  id="password"
                  type="password"
                  placeholder={t("auth.passwordPlaceholder")}
                  disabled={isLoading}
                  autoComplete="current-password"
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
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
                className="w-full px-6 py-3"
              >
                {isLoading ? t("auth.signingIn") : t("auth.signIn")}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm"></div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {t("auth.noAccount")}{" "}
                <Link
                  href="/auth/register"
                  className="text-primary hover:text-primary-dark font-medium transition-colors"
                >
                  {t("auth.signUp")}
                </Link>
              </p>
              <p className="text-gray-600">
                {t("auth.forgotPassword")}{" "}
                <Link
                  href="/auth/forgot-password"
                  className="text-primary hover:text-primary-dark font-medium transition-colors"
                >
                  {t("auth.resetPassword")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}