"use client"

/**
 * Patient Card Component
 * Individual patient card with quick actions
 */

import Image from "next/image"
import { useRouter } from "next/navigation"
import type { PatientWithStats } from "@/types/patient.types"
import { getAgeDisplay } from "@/types/patient.types"
import { Play, MessageSquare, Gamepad2, MoreVertical, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

interface PatientCardProps {
  patient: PatientWithStats
  onEdit: () => void
  onDelete: () => void
}

export function PatientCard({ patient, onEdit, onDelete }: PatientCardProps) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  const age = getAgeDisplay(patient.date_of_birth)
  const progressPercentage = patient.average_score || 0

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        {/* Avatar and Info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center overflow-hidden">
            {patient.avatar_url ? (
              <Image
                src={patient.avatar_url}
                alt={patient.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-2xl font-bold">
                {patient.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{patient.name}</h3>
            <p className="text-sm text-gray-600">{age}</p>
            <p className="text-xs text-gray-500 mt-1">
              {patient.condition.replace(/_/g, " ")}
            </p>
          </div>
        </div>

        {/* More Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={() => {
                  onEdit()
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => {
                  if (confirm(`Tem a certeza que deseja eliminar ${patient.name}?`)) {
                    onDelete()
                  }
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progresso</span>
          <span className="text-sm font-semibold text-purple-600">{progressPercentage}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-600">Sessões</p>
          <p className="text-lg font-semibold text-gray-900">{patient.total_sessions}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Esta Semana</p>
          <p className="text-lg font-semibold text-gray-900">{patient.sessions_this_week}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => router.push(`/aac?patientId=${patient.id}`)}
          className="flex items-center justify-center gap-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
        >
          <MessageSquare className="w-4 h-4" />
          AAC
        </button>
        <button
          onClick={() => router.push(`/games?patientId=${patient.id}`)}
          className="flex items-center justify-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
        >
          <Gamepad2 className="w-4 h-4" />
          Jogos
        </button>
        <button
          onClick={() => router.push(`/dashboard/patient/${patient.id}`)}
          className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
        >
          <Play className="w-4 h-4" />
          Ver
        </button>
      </div>
    </div>
  )
}
