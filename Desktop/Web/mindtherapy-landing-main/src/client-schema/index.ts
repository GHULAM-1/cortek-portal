/**
 * Central export for all Zod validation schemas
 */

// Auth schemas
export {
  loginSchema,
  signupSchema,
  recoverPasswordSchema,
  resetPasswordSchema,
  onboardingSchema,
  type LoginFormData,
  type SignupFormData,
  type RecoverPasswordFormData,
  type ResetPasswordFormData,
  type OnboardingFormData,
} from "./auth.schema"

// Patient schemas
export {
  createPatientSchema,
  updatePatientSchema,
  sessionSchema,
  type CreatePatientFormData,
  type UpdatePatientFormData,
  type SessionFormData,
} from "./patient.schema"

// Settings schemas
export {
  profileSettingsSchema,
  notificationSettingsSchema,
  preferenceSettingsSchema,
  fullSettingsSchema,
  type ProfileSettingsFormData,
  type NotificationSettingsFormData,
  type PreferenceSettingsFormData,
  type FullSettingsFormData,
} from "./settings.schema"
