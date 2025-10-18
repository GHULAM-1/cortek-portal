import { StatsCardSkeleton, PatientCardSkeleton } from "@/components/PatientCardSkeleton"

/**
 * Dashboard Loading State
 * Shown while server component is fetching data
 */

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>

        {/* Patient Cards Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PatientCardSkeleton />
          <PatientCardSkeleton />
          <PatientCardSkeleton />
          <PatientCardSkeleton />
          <PatientCardSkeleton />
          <PatientCardSkeleton />
        </div>
      </div>
    </div>
  )
}
