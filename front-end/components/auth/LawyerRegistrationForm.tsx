'use client'

import { useTranslation } from 'react-i18next'
import { FiMail, FiLock, FiUser, FiBriefcase, FiFileText } from 'react-icons/fi'
import DatePickerField from '@/components/common/DatePickerField'
import { Controller, useFormContext } from 'react-hook-form'
import Link from "next/link";

interface LawyerRegistrationFormProps {
  isLoading: boolean
}

export default function LawyerRegistrationForm({
                                                 isLoading
                                               }: LawyerRegistrationFormProps) {
  const { t } = useTranslation()
  const { register, control, formState: { errors } } = useFormContext()

  // Use a type assertion to handle the complex union type for lawyer_profile errors
  const lawyerErrors = errors.lawyer_profile as any

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
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                className={`w-full pl-10 px-4 py-3 rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition-colors`}
                id="email"
                type="email"
                placeholder={t('auth.emailPlaceholder', 'Enter your email address')}
                disabled={isLoading}
                {...field}
              />
            )}
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

      {/* Last Name */}
      <div>
        <label htmlFor="lawyer_profile.last_name" className="block text-sm font-medium text-gray-700 mb-1">
          {t('auth.lastName')}
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <FiUser />
          </span>
          <input
            className={`w-full pl-10 px-4 py-3 rounded-md border ${lawyerErrors?.last_name ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition-colors`}
            id="lawyer_profile.last_name"
            type="text"
            placeholder={t('auth.lastNamePlaceholder', 'Enter your last name')}
            disabled={isLoading}
            {...register('lawyer_profile.last_name')}
          />
        </div>
        {lawyerErrors?.last_name && (
          <p className="mt-1 text-sm text-red-600">
            {lawyerErrors.last_name.message?.toString()}
          </p>
        )}
      </div>

      {/* First Name */}
      <div>
        <label htmlFor="lawyer_profile.first_name" className="block text-sm font-medium text-gray-700 mb-1">
          {t('auth.firstName')}
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <FiUser />
          </span>
          <input
            className={`w-full pl-10 px-4 py-3 rounded-md border ${lawyerErrors?.first_name ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition-colors`}
            id="lawyer_profile.first_name"
            type="text"
            placeholder={t('auth.firstNamePlaceholder', 'Enter your first name')}
            disabled={isLoading}
            {...register('lawyer_profile.first_name')}
          />
        </div>
        {lawyerErrors?.first_name && (
          <p className="mt-1 text-sm text-red-600">
            {lawyerErrors.first_name.message?.toString()}
          </p>
        )}
      </div>

      {/* Affiliation */}
      <div>
        <label htmlFor="lawyer_profile.affiliation" className="block text-sm font-medium text-gray-700 mb-1">
          {t('auth.affiliation')}
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <FiBriefcase />
          </span>
          <input
            className={`w-full pl-10 px-4 py-3 rounded-md border ${lawyerErrors?.affiliation ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition-colors`}
            id="lawyer_profile.affiliation"
            type="text"
            placeholder={t('auth.affiliationPlaceholder', 'Enter your law firm or organization')}
            disabled={isLoading}
            {...register('lawyer_profile.affiliation')}
          />
        </div>
        {lawyerErrors?.affiliation && (
          <p className="mt-1 text-sm text-red-600">
            {lawyerErrors.affiliation.message?.toString()}
          </p>
        )}
      </div>

      {/* Lawyer Registration Number */}
      <div>
        <label htmlFor="lawyer_profile.lawyer_registration_number" className="block text-sm font-medium text-gray-700 mb-1">
          {t('auth.registrationNumber')}
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <FiFileText />
          </span>
          <input
            className={`w-full pl-10 px-4 py-3 rounded-md border ${lawyerErrors?.lawyer_registration_number ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 transition-colors`}
            id="lawyer_profile.lawyer_registration_number"
            type="text"
            placeholder={t('auth.registrationNumberPlaceholder', 'Enter your 5-digit registration number')}
            disabled={isLoading}
            {...register('lawyer_profile.lawyer_registration_number')}
          />
        </div>
        {lawyerErrors?.lawyer_registration_number && (
          <p className="mt-1 text-sm text-red-600">
            {lawyerErrors.lawyer_registration_number.message?.toString()}
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