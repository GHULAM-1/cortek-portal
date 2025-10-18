import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AppHeader from "@/components/app-header"

/**
 * Dashboard Layout
 * Used for authenticated app pages (dashboard, settings, etc.)
 * Includes authentication check and shared app header
 */

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/login")
  }

  // Check if profile is completed (for onboarding)
  if (!profile.profile_completed) {
    redirect("/onboarding")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader user={user} profile={profile} />
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}
