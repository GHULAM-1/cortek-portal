import type { ReactNode } from "react"
import AuthHeader from "@/components/AuthHeader"

/**
 * Auth Layout
 * Used for authentication pages (login, signup, forgot-password, onboarding)
 * Includes shared auth header
 */

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col">
      <AuthHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>
    </div>
  )
}
