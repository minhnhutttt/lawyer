'use client'

import { useTranslation } from 'react-i18next'
import { FiMail, FiLock, FiUser } from 'react-icons/fi'
import { useFormContext } from 'react-hook-form'
import Link from "next/link";

interface ClientRegistrationFormProps {
  isLoading: boolean
}

export default function ClientRegistrationForm({
                                                 isLoading
                                               }: ClientRegistrationFormProps) {
  const { t } = useTranslation()
  const { register, formState: { errors } } = useFormContext()

  return (
    <div className="space-y-4">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          {t('auth.email')}
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <FiMail />
          </span>
          <input
            className={`w-full pl-10 px-4 py-3 rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition-colors`}
            id="email"
            type="email"
            placeholder={t('auth.emailPlaceholder', 'Enter your email address')}
            disabled={isLoading}
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
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          {t('auth.password')}
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <FiLock />
          </span>
          <input
            className={`w-full pl-10 px-4 py-3 rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition-colors`}
            id="password"
            type="password"
            placeholder={t('auth.passwordPlaceholder', 'Create a password (minimum 8 characters)')}
            disabled={isLoading}
            {...register('password')}
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">
            {errors.password.message?.toString()}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
          {t('auth.confirmPassword')}
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <FiLock />
          </span>
          <input
            className={`w-full pl-10 px-4 py-3 rounded-md border ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition-colors`}
            id="confirm_password"
            type="password"
            placeholder={t('auth.confirmPasswordPlaceholder', 'Confirm your password')}
            disabled={isLoading}
            {...register('confirm_password')}
          />
        </div>
        {errors.confirm_password && (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirm_password.message?.toString()}
          </p>
        )}
      </div>

      {/* Nickname */}
      <div>
        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
          {t('auth.nickname')}
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <FiUser />
          </span>
          <input
            className={`w-full pl-10 px-4 py-3 rounded-md border ${errors.nickname ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition-colors`}
            id="nickname"
            type="text"
            placeholder={t('auth.nicknamePlaceholder', 'Enter your nickname')}
            disabled={isLoading}
            {...register('nickname')}
          />
        </div>
        {errors.nickname && (
          <p className="mt-1 text-sm text-red-600">
            {errors.nickname.message?.toString()}
          </p>
        )}
      </div>

      {/* Terms of Service */}
      <div className="mt-6">
        <div className="flex items-start">
          <input
            id="acceptTerms"
            type="checkbox"
            className={`h-4 w-4 text-primary focus:ring-primary ${errors.acceptTerms ? 'border-red-500' : 'border-gray-300'} rounded mt-1`}
            disabled={isLoading}
            {...register('acceptTerms')}
          />
          <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
            {t('auth.agreeToTerms', 'I agree to the ')}
            {' '}
            <Link href="/terms" target="_blank" className="text-primary hover:text-primary-dark underline">
              {t('auth.termsOfService', 'Terms of Service')}
            </Link>
            {' '}
            &
            {' '}
            <Link href="/privacy" target="_blank" className="text-primary hover:text-primary-dark underline">
              {t('auth.privacyPolicy', 'Privacy Policy')}
            </Link>
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="mt-1 text-sm text-red-600">
            {errors.acceptTerms.message?.toString()}
          </p>
        )}
      </div>
    </div>
  )
}