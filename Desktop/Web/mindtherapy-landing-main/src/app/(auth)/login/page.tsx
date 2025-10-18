import Image from "next/image"
import { Shield, Heart, CheckCircle, LogIn } from "lucide-react"
import { LoginForm } from "@/components/auth/login-form"

/**
 * Login Page (Server Component)
 * Public page for user authentication
 */

export const metadata = {
  title: "Login | MindTherapy",
  description: "Aceda à sua conta MindTherapy",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col">
      {/* Background Image */}
      <div className="absolute bottom-0 right-0 w-1/3 h-2/3 opacity-10 hidden lg:block">
        <Image
          src="/gabi-helping-a-kid.jpg"
          alt="MindTherapy"
          fill
          className="object-contain object-bottom-right"
        />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <LogIn className="w-4 h-4" />
            <span>Bem-vindo de volta</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Fazer Login</h1>
          <p className="text-lg text-gray-600 mb-6">Aceda à sua conta e continue a sua jornada</p>

          {/* Trust Indicators */}
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Dados protegidos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-600" />
              <span>Apoio 24/7</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
