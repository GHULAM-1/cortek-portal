import type { Metadata } from "next"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Redefinir Password | MindTherapy",
  description: "Defina uma nova password para a sua conta MindTherapy",
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col">
      <main className="relative overflow-x-hidden flex-1 flex items-center justify-center">
        <ResetPasswordForm />
      </main>
    </div>
  )
}
