import type { Metadata } from "next"
import { SignupForm } from "@/components/auth/signup-form"

export const metadata: Metadata = {
  title: "Criar Conta | MindTherapy",
  description: "Crie a sua conta MindTherapy e junte-se à revolução do apoio terapêutico",
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col overflow-hidden">
      <main className="relative overflow-x-hidden flex-1 flex items-center justify-center">
        <SignupForm />
      </main>
    </div>
  )
}
