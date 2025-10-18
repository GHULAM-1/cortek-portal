"use client"

/**
 * Dashboard Sidebar
 * Navigation sidebar for different views
 */

import { Home, Users, BarChart3, FileText } from "lucide-react"
import Image from "next/image"
import type { DashboardSidebarProps } from "@/types/component.types"

export function DashboardSidebar({
  currentView,
  onViewChange,
  needsAttentionCount,
}: DashboardSidebarProps) {
  const navItems = [
    {
      id: "dashboard" as const,
      label: "Dashboard",
      icon: Home,
    },
    {
      id: "patients" as const,
      label: "Pessoas",
      icon: Users,
      badge: needsAttentionCount > 0 ? needsAttentionCount : undefined,
    },
    {
      id: "progress" as const,
      label: "Progresso",
      icon: BarChart3,
    },
    {
      id: "reports" as const,
      label: "Relatórios",
      icon: FileText,
    },
  ]

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200 hidden lg:block">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Image
              src="/logos/mindtherapy.svg"
              alt="MindTherapy"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <h1 className="text-lg font-bold text-gray-900">MindTherapy</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors
                  ${isActive
                    ? "bg-purple-50 text-purple-600"
                    : "text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? "text-purple-600" : "text-gray-400"}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-1 text-xs font-semibold text-white bg-orange-500 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
