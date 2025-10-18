import type { Metadata } from "next"
import { OnboardingForm } from "@/components/auth/onboarding-form"

export const metadata: Metadata = {
  title: "Complete o Seu Perfil | MindTherapy",
  description: "Complete o seu perfil MindTherapy para personalizar a sua experiência",
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col overflow-hidden">
      <main className="relative overflow-x-hidden flex-1 flex items-center justify-center">
        <OnboardingForm />
      </main>
    </div>
  )
}
