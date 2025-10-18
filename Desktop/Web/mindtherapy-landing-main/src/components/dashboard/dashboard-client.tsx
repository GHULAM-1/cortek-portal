"use client"

/**
 * Dashboard Client Component
 * Main dashboard UI with patient management
 * Receives initial data from server component to prevent hydration errors
 */

import { useState } from "react"
import type { PatientWithStats } from "@/types/patient.types"
import type { DashboardClientProps } from "@/types/component.types"
import { DashboardStats } from "./dashboard-stats"
import { DashboardHeader } from "./dashboard-header"
import { PatientsList } from "./patients-list"
import { DashboardSidebar } from "./dashboard-sidebar"

export function DashboardClient({ userProfile, initialPatients }: DashboardClientProps) {
  const [patients, setPatients] = useState<PatientWithStats[]>(initialPatients)
  const [currentView, setCurrentView] = useState<"dashboard" | "patients" | "progress" | "reports">("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "needs_attention">("all")

  // Calculate stats
  const totalPatients = patients.length
  const activePatients = patients.filter((p) => p.status === "active").length
  const averageProgress = patients.length > 0
    ? Math.round(patients.reduce((sum, p) => sum + (p.average_score || 0), 0) / patients.length)
    : 0
  const needsAttention = patients.filter((p) => p.status === "needs_attention").length

  // Filter patients
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          needsAttentionCount={needsAttention}
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <DashboardHeader
            userProfile={userProfile}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          <main className="p-6">
            {/* Stats Cards */}
            <DashboardStats
              totalPatients={totalPatients}
              activePatients={activePatients}
              averageProgress={averageProgress}
              needsAttention={needsAttention}
            />

            {/* Patients List */}
            <PatientsList
              patients={filteredPatients}
              onPatientsChange={setPatients}
            />
          </main>
        </div>
      </div>
    </div>
  )
}
