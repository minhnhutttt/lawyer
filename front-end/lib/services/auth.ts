import { post, get } from '../api'
import { LoginResponse, RegisterResponse, PasswordResetResponse, VerifyEmailResponse,
  LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest,
  ResendVerificationRequest, ResendVerificationResponse } from '../types/auth'
import { ApiResponse } from '../types/api'
import Cookies from 'js-cookie'

// Login user
export async function login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  return post<LoginResponse>('/auth/login', data)
}

// Register new user
export async function register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
  return post<RegisterResponse>('/auth/register', data)
}

// Logout user
export async function logout(): Promise<void> {
  try {
    // Attempt to logout on server
    await post('/auth/logout', {})
  } finally {
    // Always clear local storage and cookies
    localStorage.removeItem('auth-token')
    Cookies.remove('token')
  }
}

// Send password reset email
export async function forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<PasswordResetResponse>> {
  return post<PasswordResetResponse>('/auth/forgot-password', data)
}

// Reset password with token
export async function resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<PasswordResetResponse>> {
  return post<PasswordResetResponse>('/auth/reset-password', data)
}

// Verify email with token
export async function verifyEmail(token: string): Promise<ApiResponse<VerifyEmailResponse>> {
  return get<VerifyEmailResponse>(`/auth/verify-email/${token}`)
}

// Resend verification email
export async function resendVerification(data: ResendVerificationRequest): Promise<ApiResponse<ResendVerificationResponse>> {
  return post<ResendVerificationResponse>('/auth/resend-verification', data)
}

export default {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification
} 