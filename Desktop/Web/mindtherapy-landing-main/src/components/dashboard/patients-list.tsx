"use client"

/**
 * Patients List Component
 * Displays patient cards with actions
 */

import { useState } from "react"
import type { PatientWithStats } from "@/types/patient.types"
import { PatientCard } from "./patient-card"
import { AddPatientModal } from "./add-patient-modal"
import { EditPatientModal } from "./edit-patient-modal"
import { Plus } from "lucide-react"

interface PatientsListProps {
  patients: PatientWithStats[]
  onPatientsChange: (patients: PatientWithStats[]) => void
}

export function PatientsList({ patients, onPatientsChange }: PatientsListProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPatient, setEditingPatient] = useState<PatientWithStats | null>(null)

  return (
    <>
      {/* Add Patient Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Adicionar Pessoa</span>
        </button>
      </div>

      {/* Patients Grid */}
      {patients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhuma pessoa encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onEdit={() => setEditingPatient(patient)}
              onDelete={() => {
                // Handle delete
                onPatientsChange(patients.filter((p) => p.id !== patient.id))
              }}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddPatientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={(newPatient) => {
          onPatientsChange([...patients, newPatient as PatientWithStats])
          setShowAddModal(false)
        }}
      />

      {editingPatient && (
        <EditPatientModal
          isOpen={true}
          patient={editingPatient}
          onClose={() => setEditingPatient(null)}
          onSuccess={(updatedPatient) => {
            onPatientsChange(
              patients.map((p) =>
                p.id === updatedPatient.id ? (updatedPatient as PatientWithStats) : p
              )
            )
            setEditingPatient(null)
          }}
        />
      )}
    </>
  )
}
