/**
 * Zod Validation Schemas for Authentication Forms
 */

import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .min(1, "Password é obrigatória"),
  rememberMe: z.boolean().default(false),
})

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .min(8, "Esta password é muito curta. Use pelo menos 8 caracteres.")
    .max(100, "Password demasiado longa"),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: "Deve aceitar os termos e condições",
    }),
  acceptNewsletter: z.boolean().default(true),
})

export const recoverPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
})

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Esta password é muito curta. Use pelo menos 8 caracteres.")
      .max(100, "Password demasiado longa"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As passwords não coincidem",
    path: ["confirmPassword"],
  })

export const onboardingSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(2, "Nome demasiado curto")
    .max(100, "Nome demasiado longo"),
  situation: z
    .string()
    .min(1, "Situação é obrigatória"),
})

// Type inference from schemas
export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type RecoverPasswordFormData = z.infer<typeof recoverPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type OnboardingFormData = z.infer<typeof onboardingSchema>
