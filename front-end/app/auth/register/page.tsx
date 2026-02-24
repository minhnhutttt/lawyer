'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useToast } from '@/components/common/Toast'
import ClientRegistrationForm from '@/components/auth/ClientRegistrationForm'
import LawyerRegistrationForm from '@/components/auth/LawyerRegistrationForm'
import { Button } from '@/components/ui/button'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Define the form data type matching the Zod schema shape
interface FormData {
  email: string
  password: string
  confirm_password: string
  nickname?: string
  role: 'client' | 'lawyer' | 'admin'
  lawyer_profile?: {
    email?: string
    first_name?: string
    last_name?: string
    affiliation?: string
    lawyer_registration_number?: string
  }
  acceptTerms: boolean
}

// Create a function to generate the Zod schema with translations
// Corrected Zod Schema
const createFormSchema = (t: Function) => z.object({
  email: z.string()
    .min(1, { message: t('validation.email.required', 'Email is required') })
    .email({ message: t('validation.email.invalid', 'Please enter a valid email address') }),
  password: z.string()
    .min(1, { message: t('validation.password.required', 'Password is required') })
    .min(8, { message: t('validation.password.minLength', 'Password must be at least 8 characters long') }),
  confirm_password: z.string()
    .min(1, { message: t('validation.confirmPassword.required', 'Please confirm your password') }),
  nickname: z.string().optional(),
  role: z.enum(['client', 'lawyer', 'admin']),
  // Make the lawyer_profile and all its fields optional at the base level.
  // The validation will be handled conditionally in superRefine.
  lawyer_profile: z.object({
    email: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    affiliation: z.string().optional(),
    lawyer_registration_number: z.string().optional(),
  }).optional(),
  acceptTerms: z.boolean()
    .refine(val => val === true, {
      message: t('validation.acceptTerms.required', 'You must accept the Terms of Service'),
    }),
}).refine(data => data.password === data.confirm_password, {
  message: t('validation.confirmPassword.mismatch', 'Passwords do not match'),
  path: ['confirm_password'],
}).superRefine((data, ctx) => {
  // Conditional validation based on the selected role
  if (data.role === 'client') {
    if (!data.nickname || data.nickname.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('validation.nickname.required', 'Nickname is required for client accounts'),
        path: ['nickname'],
      });
    }
  }

  if (data.role === 'lawyer') {
    // Define the required schema for lawyers
    const lawyerSchema = z.object({
      first_name: z.string().min(1, { message: t('validation.firstName.required', 'First name is required') }),
      last_name: z.string().min(1, { message: t('validation.lastName.required', 'Last name is required') }),
      affiliation: z.string().min(1, { message: t('validation.affiliation.required', 'Affiliation is required') }),
      lawyer_registration_number: z.string()
        .min(1, { message: t('validation.registrationNumber.required', 'Registration number is required') })
        .regex(/^\d{5}$/, { message: t('validation.registrationNumber.format', 'Registration number must be exactly 5 digits') }),
    });

    // Validate the lawyer profile against the stricter schema
    const result = lawyerSchema.safeParse(data.lawyer_profile);
    if (!result.success) {
      result.error.issues.forEach(issue => {
        ctx.addIssue({
          ...issue,
          path: ['lawyer_profile', ...issue.path], // Prepend 'lawyer_profile' to the path
        });
      });
    }
  }
});

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const { register, error, error_code, isLoading, isAuthenticated, clearError } = useAuthStore()
  const { success: successToast } = useToast()
  const initialRole = searchParams?.get('role') === 'lawyer' ? 'lawyer' : 'client'
  const [step, setStep] = useState(1)
  
  // Create the form schema with translations
  // Create schema with i18n
  const formSchema = createFormSchema((key: string, defaultValue?: string) => t(key, defaultValue || ''))
  
  // Set up form with Zod validation
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: initialRole,
      acceptTerms: false,
      email: '',
      password: '',
      confirm_password: '',
      nickname: '',
      lawyer_profile: {
        first_name: '',
        last_name: '',
        affiliation: '',
        lawyer_registration_number: ''
      }
    }
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/auth/login')
    }
    // Clear any existing errors when component mounts
    clearError()
  }, [isAuthenticated, router, clearError])

  const onSubmit = (data: FormData) => {
    // Validation has already been handled by Zod
    // Create registration payload
    if (data.role === 'client') {
      // Client registration
      const payload = {
        email: data.email,
        password: data.password,
        role: data.role,
        nickname: data.nickname || '' // Ensure nickname is never undefined
      };

      // Submit registration
      register(payload)
        .then(() => {
          successToast(t('auth.registrationSuccess', 'Registration successful!'))
          // Navigate to login page after successful registration
          router.push('/auth/login')
        })
        .catch(() => {}); // Catch errors to prevent unhandled promise rejection

    } else if (data.role === 'lawyer' && data.lawyer_profile) {
      // Lawyer registration
      const payload = {
        email: data.email,
        password: data.password,
        role: data.role,
        nickname: '', // Auth store expects nickname, provide empty string for lawyers
        lawyer_profile: {
          email: data.email,
          first_name: data.lawyer_profile.first_name || '',
          last_name: data.lawyer_profile.last_name || '',
          affiliation: data.lawyer_profile.affiliation || '',
          lawyer_registration_number: data.lawyer_profile.lawyer_registration_number || ''
        }
      };

      // Submit registration
      register(payload)
        .then(() => {
          successToast(t('auth.registrationSuccess', 'Registration successful!'))
          // Navigate to login page after successful registration
          router.push('/auth/login')
        })
        .catch(() => {}); // Catch errors to prevent unhandled promise rejection
    }
  }

  // Update role when changed in step 1
  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    methods.setValue('role', e.target.value as 'client' | 'lawyer' | 'admin')
  }

  // Determine if user should proceed to step 2 or submit form
  const nextStepOrSubmit = () => {
    if (step === 1) {
      nextStep()
    } else {
      // For both roles, we'll validate all relevant fields
      // First trigger all form validation
      methods.trigger().then(() => {
        // For lawyer role, specially focus on lawyer profile fields
        if (methods.getValues('role') === 'lawyer') {
          // Manually set focus on the fields to ensure errors are displayed
          if (methods.formState.errors.lawyer_profile?.first_name) {
            document.getElementById('lawyer_profile.first_name')?.focus();
          } else if (methods.formState.errors.lawyer_profile?.last_name) {
            document.getElementById('lawyer_profile.last_name')?.focus();
          } else if (methods.formState.errors.lawyer_profile?.affiliation) {
            document.getElementById('lawyer_profile.affiliation')?.focus();
          } else if (methods.formState.errors.lawyer_profile?.lawyer_registration_number) {
            document.getElementById('lawyer_profile.lawyer_registration_number')?.focus();
          }
        }
        
        // If the form is valid, submit it
        if (Object.keys(methods.formState.errors).length === 0) {
          methods.handleSubmit(onSubmit)();
        }
      });
    }
  }

  const nextStep = () => {
    setStep((prev: number) => Math.min(prev + 1, 2))
  }

  const prevStep = () => {
    setStep((prev: number) => Math.max(prev - 1, 1))
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {t('auth.createAccount')}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {t('auth.createAccountPrompt')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              <div dangerouslySetInnerHTML={{
                __html: t(`errors.errorCodes.${error_code}`, {
                  resend_link: "/auth/verify-email"
                })
              }} />
            </div>
          )}

          <FormProvider {...methods}>
            <form id="registration-form" onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Account Type Selection */}
            {step === 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('auth.selectAccountType')}
                </label>
                <div className="flex flex-col space-y-3">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="client"
                      checked={methods.watch('role') === 'client'}
                      onChange={handleRoleChange}
                      className="h-5 w-5 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="ml-2 text-gray-700">{t('auth.client')}</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="lawyer"
                      checked={methods.watch('role') === 'lawyer'}
                      onChange={handleRoleChange}
                      className="h-5 w-5 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="ml-2 text-gray-700">{t('auth.lawyer')}</span>
                  </label>
                </div>
                
                <div className="mt-8">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-md font-medium text-gray-900">
                      {methods.watch('role') === 'client' ? t('auth.clientAccountInfo') : t('auth.lawyerAccountInfo')}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {methods.watch('role') === 'client' 
                        ? t('auth.clientAccountDescription')
                        : t('auth.lawyerAccountDescription')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Account Information Forms */}
            {step === 2 && methods.watch('role') === 'client' && (
              <ClientRegistrationForm 
                isLoading={isLoading}
              />
            )}

            {step === 2 && methods.watch('role') === 'lawyer' && (
              <LawyerRegistrationForm 
                isLoading={isLoading}
              />
            )}
            
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <Button 
                  type="button" 
                  onClick={prevStep}
                  variant="outline"
                  className="px-6 py-2"
                  disabled={isLoading}
                >
                  {t('auth.back')}
                </Button>
              )}
              
              <Button 
                type="button" 
                onClick={nextStepOrSubmit}
                disabled={isLoading}
                className={`${step > 1 ? 'ml-auto' : 'w-full'} px-6 py-2`}
              >
                {isLoading ? t('auth.creatingAccount') : (step === 1 ? t('auth.next') : t('auth.createAccount'))}
              </Button>
            </div>
          </form>
          </FormProvider>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {t('auth.haveAccount')}{" "}
              <Link href="/auth/login" className="text-primary hover:text-primary-dark font-medium transition-colors">
                {t('auth.signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
