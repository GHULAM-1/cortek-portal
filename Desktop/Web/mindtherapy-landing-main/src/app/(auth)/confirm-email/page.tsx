import type { Metadata } from "next"
import { ConfirmEmailContent } from "@/components/auth/confirm-email-content"

export const metadata: Metadata = {
  title: "Confirme o seu Email | MindTherapy",
  description: "Verifique o seu email para confirmar a sua conta MindTherapy",
}

export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col">
      <main className="relative overflow-x-hidden flex-1 flex items-center justify-center">
        <ConfirmEmailContent />
      </main>
    </div>
  )
}
