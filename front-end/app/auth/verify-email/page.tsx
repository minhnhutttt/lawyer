'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { FiCheck, FiAlertTriangle, FiMail } from 'react-icons/fi'
import { verifyEmail, resendVerification } from '@/lib/services/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/auth-store'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Create a function to generate the Zod schema with translations
const createEmailSchema = (t: Function) => z.object({
  email: z.string()
    .min(1, { message: t('validation.email.required', 'Email is required') })
    .email({ message: t('validation.email.invalid', 'Please enter a valid email address') })
    .max(255, { message: t('validation.email.maxLength', 'Email cannot exceed 255 characters') })
});

// Define the email form data type
interface EmailFormData {
  email: string;
}

// Separate component to handle token verification
// This isolates the verification logic and prevents multiple calls
interface TokenVerifierProps {
  token: string;
  onVerificationStart: () => void;
  onVerificationComplete: (message: string) => void;
  onVerificationError: (message: string) => void;
}

const TokenVerifier = ({ token, onVerificationStart, onVerificationComplete, onVerificationError }: TokenVerifierProps) => {
  const { t } = useTranslation()
  const hasVerified = useRef(false)
  
  useEffect(() => {
    // Only attempt verification once
    if (token && !hasVerified.current) {
      hasVerified.current = true
      verifyToken()
    }
  }, [token, onVerificationStart, onVerificationComplete, onVerificationError]);
  
  const verifyToken = async () => {
    onVerificationStart()
    
    try {
      const response = await verifyEmail(token)
      onVerificationComplete(response.data?.message || t('auth.verifyEmail.success'))
    } catch (error) {
      onVerificationError(t('auth.verifyEmail.error'))
    }
  }
  
  return null; // This component doesn't render anything
}

export default function VerifyEmail() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const { isAuthenticated } = useAuthStore()

  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | 'pending'>('pending')
  const [message, setMessage] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<'success' | 'error' | null>(null)
  const [resendMessage, setResendMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [error_code, setError_code] = useState<string | null>(null)
  
  // Create the email schema with translations
  const emailSchema = createEmailSchema(t)
  
  // Set up form with validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: ''
    }
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect authenticated users to home page
      router.replace('/')
    }
  }, [isAuthenticated, router])

  const handleVerificationStart = () => {
    setIsVerifying(true)
    setVerificationStatus('pending')
  }
  
  const handleVerificationComplete = (successMessage: string) => {
    setVerificationStatus('success')
    setMessage(successMessage)
    setIsVerifying(false)
    
    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push('/auth/login')
    }, 3000)
  }
  
  const handleVerificationError = (errorMessage: string) => {
    setVerificationStatus('error')
    setMessage(errorMessage)
    setIsVerifying(false)
  }

  // Form submission handler using React Hook Form
  const onSubmit = async (data: EmailFormData) => {
    if (isResending) return
    
    setIsResending(true)
    setResendStatus(null)
    setError(null)
    setError_code(null)
    
    try {
      await resendVerification({ email: data.email })
      setResendStatus('success')
      setResendMessage(t('auth.verifyEmail.resendSuccess'))
    } catch (err: any) {
      setResendStatus('error')
      setError(err?.message || t('auth.verifyEmail.resendError'))
      setError_code(err?.code || 'unknown_error')
    } finally {
      setIsResending(false)
    }
  }

  const renderVerificationContent = () => {
    if (token) {
      return (
        <div className="text-center">
          {verificationStatus === 'pending' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">{t('auth.verifyEmail.verifying')}</h2>
              <div className="animate-pulse">{t('auth.verifyEmail.pleaseWait')}</div>
            </div>
          )}
          
          {verificationStatus === 'success' && (
            <div>
              <div className="flex justify-center mb-4">
                <FiCheck className="h-12 w-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">{t('auth.verifyEmail.verified')}</h2>
              <p className="text-sm">{t('auth.verifyEmail.redirecting')}</p>
            </div>
          )}
          
          {verificationStatus === 'error' && (
            <div>
              <div className="flex justify-center mb-4">
                <FiAlertTriangle className="h-12 w-12 text-red-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">{t('auth.verifyEmail.verificationFailed')}</h2>
              <p className="mb-6">{message}</p>
              <div className="flex flex-col space-y-4">
                <Link href="/auth/login" className="text-blue-600 hover:underline">
                  {t('auth.verifyEmail.backToLogin')}
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={() => setToken(null)} 
                  className="text-blue-600 hover:underline p-0"
                >
                  {t('auth.verifyEmail.resendVerification')}
                </Button>
              </div>
            </div>
          )}
        </div>
      )
    }
    
    // Show resend verification form if no token
    return (
      <div>
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <FiMail className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold">{t('auth.verifyEmail.needVerification')}</h2>
          <p className="mt-2">{t('auth.verifyEmail.enterEmail')}</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              id="email"
              type="text"
              label={t('auth.email')}
              placeholder={t('auth.emailPlaceholder')}
              {...register('email')}
              disabled={isResending}
              className={`w-full rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message?.toString()}
              </p>
            )}
          </div>
          
          {resendStatus === 'success' && (
            <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-700 border border-green-200">
              {resendMessage}
            </div>
          )}
          
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              <div dangerouslySetInnerHTML={{
                __html: t(`errors.errorCodes.${error_code}`, {
                  resend_link: "/auth/verify-email"
                })
              }} />
            </div>
          )}
          
          <Button
            type="submit"
            fullWidth
            isLoading={isResending}
            disabled={isResending}
          >
            {t('auth.verifyEmail.resendButton')}
          </Button>
          
          <div className="text-center">
            <Link href="/auth/login" className="text-blue-600 hover:underline text-sm">
              {t('auth.verifyEmail.backToLogin')}
            </Link>
          </div>
        </form>
      </div>
    )
  }

  // Helper function to manually clear token (used when switching to resend form)
  const setToken = (newToken: string | null) => {
    if (newToken === null) {
      // Replace current URL without the token
      const url = new URL(window.location.href)
      url.searchParams.delete('token')
      window.history.replaceState({}, '', url.toString())
      router.refresh() // Force a refresh of the current page
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {token && (
        <TokenVerifier
          token={token}
          onVerificationStart={handleVerificationStart}
          onVerificationComplete={handleVerificationComplete}
          onVerificationError={handleVerificationError}
        />
      )}
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {t('auth.verifyEmail.title')}
          </h1>
        </div>
        <div className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          {renderVerificationContent()}
        </div>
      </div>
    </div>
  )
} 