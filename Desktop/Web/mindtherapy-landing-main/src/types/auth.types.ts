/**
 * Authentication Related Types
 */

export type LoginData = {
  email: string
  password: string
  rememberMe: boolean
}

export type SignupData = {
  email: string
  password: string
  acceptTerms: boolean
  acceptNewsletter: boolean
}

export type RecoverData = {
  email: string
}

export type ResetPasswordData = {
  password: string
  confirmPassword: string
}
