import { User } from './users';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
  role: 'client' | 'lawyer';
  lawyer_profile?: {
    email: string;
    full_name: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    affiliation: string;
    registration_number: string;
  };
}

export interface RegisterResponse {
  token?: string;
  user: User;
  message?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface PasswordResetResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
} 