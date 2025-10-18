/**
 * Zod Validation Schemas for Patient Forms
 */

import { z } from "zod"

export const createPatientSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(2, "Nome demasiado curto")
    .max(100, "Nome demasiado longo"),
  date_of_birth: z
    .string()
    .min(1, "Data de nascimento é obrigatória")
    .refine((date) => {
      const birthDate = new Date(date)
      const today = new Date()
      return birthDate < today
    }, "Data de nascimento inválida"),
  diagnosis: z
    .string()
    .max(500, "Diagnóstico demasiado longo")
    .optional(),
  notes: z
    .string()
    .max(1000, "Notas demasiado longas")
    .optional(),
  avatar_url: z
    .string()
    .url("URL inválida")
    .optional(),
})

export const updatePatientSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(2, "Nome demasiado curto")
    .max(100, "Nome demasiado longo")
    .optional(),
  date_of_birth: z
    .string()
    .refine((date) => {
      const birthDate = new Date(date)
      const today = new Date()
      return birthDate < today
    }, "Data de nascimento inválida")
    .optional(),
  diagnosis: z
    .string()
    .max(500, "Diagnóstico demasiado longo")
    .optional(),
  notes: z
    .string()
    .max(1000, "Notas demasiado longas")
    .optional(),
  avatar_url: z
    .string()
    .url("URL inválida")
    .optional(),
  status: z
    .enum(["active", "inactive", "completed"])
    .optional(),
})

export const sessionSchema = z.object({
  patient_id: z.string().uuid("ID de paciente inválido"),
  session_type: z
    .string()
    .min(1, "Tipo de sessão é obrigatório"),
  duration_minutes: z
    .number()
    .min(1, "Duração deve ser pelo menos 1 minuto")
    .max(300, "Duração máxima é 5 horas"),
  notes: z
    .string()
    .max(2000, "Notas demasiado longas")
    .optional(),
  mood_before: z
    .number()
    .min(1)
    .max(5)
    .optional(),
  mood_after: z
    .number()
    .min(1)
    .max(5)
    .optional(),
})

// Type inference from schemas
export type CreatePatientFormData = z.infer<typeof createPatientSchema>
export type UpdatePatientFormData = z.infer<typeof updatePatientSchema>
export type SessionFormData = z.infer<typeof sessionSchema>
