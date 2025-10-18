/**
 * Zod Validation Schemas for Settings Forms
 */

import { z } from "zod"

export const profileSettingsSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(2, "Nome demasiado curto")
    .max(100, "Nome demasiado longo"),
  phoneCountryCode: z
    .string()
    .optional(),
  phone: z
    .string()
    .regex(/^[\d\s]+$/, "Número de telefone inválido")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(500, "Biografia demasiado longa")
    .optional(),
  organization: z
    .string()
    .max(200, "Nome da organização demasiado longo")
    .optional(),
  role: z
    .string()
    .max(100, "Função demasiado longa")
    .optional(),
})
  .refine((data) => {
    // If phone is provided, country code must also be provided
    const cleanPhone = data.phone?.replace(/\s+/g, '') || ""
    if (cleanPhone && !data.phoneCountryCode) {
      return false
    }
    return true
  }, {
    message: "Por favor, selecione o indicativo do país para o número de telefone",
    path: ["phoneCountryCode"],
  })

export const notificationSettingsSchema = z.object({
  notification_email: z.boolean().default(true),
  notification_push: z.boolean().default(true),
  notification_sms: z.boolean().default(false),
})

export const preferenceSettingsSchema = z.object({
  theme: z.enum(["light", "dark"]).default("light"),
  language: z.enum(["pt", "en", "es"]).default("pt"),
})

export const fullSettingsSchema = z.object({
  ...profileSettingsSchema.shape,
  ...notificationSettingsSchema.shape,
  ...preferenceSettingsSchema.shape,
})

// Type inference from schemas
export type ProfileSettingsFormData = z.infer<typeof profileSettingsSchema>
export type NotificationSettingsFormData = z.infer<typeof notificationSettingsSchema>
export type PreferenceSettingsFormData = z.infer<typeof preferenceSettingsSchema>
export type FullSettingsFormData = z.infer<typeof fullSettingsSchema>
