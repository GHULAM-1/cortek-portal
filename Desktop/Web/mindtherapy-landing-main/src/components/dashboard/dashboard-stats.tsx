"use client"

/**
 * Dashboard Stats Cards
 * Displays key metrics at the top of dashboard
 */

import { Users, Activity, TrendingUp, AlertTriangle } from "lucide-react"

interface DashboardStatsProps {
  totalPatients: number
  activePatients: number
  averageProgress: number
  needsAttention: number
}

export function DashboardStats({
  totalPatients,
  activePatients,
  averageProgress,
  needsAttention,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Patients */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total de Pessoas</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{totalPatients}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Active Patients */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pessoas Ativas</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{activePatients}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Average Progress */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Progresso Médio</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{averageProgress}%</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Needs Attention */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Precisam Atenção</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{needsAttention}</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  )
}
