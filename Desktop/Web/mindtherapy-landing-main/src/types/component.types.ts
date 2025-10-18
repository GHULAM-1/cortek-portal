/**
 * Component Props Types
 */

import type { Profile } from "./database.types"
import type { PatientWithStats } from "./patient.types"

// Dashboard Components
export type DashboardClientProps = {
  userProfile: Profile
  initialPatients: PatientWithStats[]
}

export type DashboardSidebarProps = {
  currentView: string
  onViewChange: (view: string) => void
  needsAttentionCount: number
}

export type DashboardHeaderProps = {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
}

export type DashboardStatsProps = {
  totalPatients: number
  activePatients: number
  averageProgress: number
  needsAttention: number
}

export type PatientsListProps = {
  patients: PatientWithStats[]
  onPatientsChange: (patients: PatientWithStats[]) => void
}

export type PatientCardProps = {
  patient: PatientWithStats
  onEdit: (patient: PatientWithStats) => void
  onDelete: (patientId: string) => void
  onClick: (patient: PatientWithStats) => void
}

export type AddPatientModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: (patient: PatientWithStats) => void
}

export type EditPatientModalProps = {
  isOpen: boolean
  patient: PatientWithStats | null
  onClose: () => void
  onSuccess: (patient: PatientWithStats) => void
}
