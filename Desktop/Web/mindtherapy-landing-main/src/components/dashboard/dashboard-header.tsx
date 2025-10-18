"use client"

/**
 * Dashboard Header
 * Top bar with breadcrumb, search, and filters
 */

import { Search } from "lucide-react"
import type { Profile } from "@/types/database.types"

interface DashboardHeaderProps {
  userProfile: Profile
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: "all" | "active" | "inactive" | "needs_attention"
  onStatusFilterChange: (filter: "all" | "active" | "inactive" | "needs_attention") => void
}

export function DashboardHeader({
  userProfile,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: DashboardHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Breadcrumb */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Bem-vindo de volta, {userProfile.full_name || "Utilizador"}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Procurar pessoas..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Todas</option>
            <option value="active">Ativas</option>
            <option value="inactive">Inativas</option>
            <option value="needs_attention">Precisam Atenção</option>
          </select>
        </div>
      </div>
    </div>
  )
}
