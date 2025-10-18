import type { Metadata } from "next"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Recuperar Password | MindTherapy",
  description: "Recupere a sua password MindTherapy",
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col">
      <main className="relative overflow-x-hidden flex-1 flex items-center justify-center">
        <ForgotPasswordForm />
      </main>
    </div>
  )
}
