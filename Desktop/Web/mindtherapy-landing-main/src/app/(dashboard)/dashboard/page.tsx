import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getPatients } from "@/app/actions/patients"
import { DashboardClient } from "@/components/dashboard/dashboard-client"

/**
 * Dashboard Page (Server Component)
 * Fetches data on the server, then passes to client component
 * This prevents hydration errors
 */

export const metadata = {
  title: "Dashboard | MindTherapy",
  description: "Gerir utentes e acompanhar progresso",
}

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get authenticated user
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

  // Fetch patients with stats (server-side)
  const patientsResult = await getPatients()

  return (
    <DashboardClient
      userProfile={profile}
      initialPatients={patientsResult.success ? patientsResult.data || [] : []}
    />
  )
}
