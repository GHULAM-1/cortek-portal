"use client"

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { getPatient } from "@/app/actions/patients"
import { Star, Trophy, Gamepad2, BookOpen, Music, Palette, Brain, Medal, Zap, Heart, LogOut } from "lucide-react"
import PinModal from "@/components/PinModal"

interface Patient {
  id: string
  name: string
  avatar_url?: string
  total_sessions: number
  points?: number
  level?: number
  streak?: number
}

type PatientPlayClientProps = {
  patientId: string
}

export function PatientPlayClient({ patientId }: PatientPlayClientProps) {
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showExitPinModal, setShowExitPinModal] = useState(false)
  const [storedPin, setStoredPin] = useState<string | null>(null)

  useEffect(() => {
    loadPatient()
  }, [patientId])

  async function loadPatient() {
    setIsLoading(true)
    try {
      // Get user profile to check global PIN
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/dashboard")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("global_child_mode_pin")
        .eq("id", user.id)
        .single()

      // Check if global PIN exists in database and session
      const sessionPin = sessionStorage.getItem(`child_mode_pin_${patientId}`)
      if (!profile?.global_child_mode_pin || !sessionPin || sessionPin !== profile.global_child_mode_pin) {
        // No PIN or session mismatch, redirect back to patient details
        router.push(`/dashboard/patient/${patientId}`)
        return
      }

      setStoredPin(profile.global_child_mode_pin)

      // Load patient data
      const result = await getPatient(patientId)
      if (result.success && result.data) {
        const p = result.data
        setPatient({
          id: p.id,
          name: p.name,
          avatar_url: p.avatar_url || undefined,
          total_sessions: p.total_sessions,
          points: 1250, // TODO: Load from gamification table
          level: 5, // TODO: Calculate from gamification data
          streak: 7, // TODO: Load from gamification table
        })
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error loading patient:", error)
      router.push("/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExitToCaregiver = () => {
    setShowExitPinModal(true)
  }

  const handleExitPinSuccess = () => {
    // Clear PIN from sessionStorage
    sessionStorage.removeItem(`child_mode_pin_${patientId}`)
    setShowExitPinModal(false)
    // Navigate back to caregiver view
    router.push(`/dashboard/patient/${patientId}`)
  }

  const games = [
    { id: 1, name: "Jogo de Memória", icon: Brain, color: "from-purple-400 to-purple-600", description: "Treina a tua memória!" },
    { id: 2, name: "Puzzle", icon: Gamepad2, color: "from-blue-400 to-blue-600", description: "Resolve puzzles divertidos" },
    { id: 3, name: "Histórias", icon: BookOpen, color: "from-green-400 to-green-600", description: "Lê histórias incríveis" },
    { id: 4, name: "Música", icon: Music, color: "from-pink-400 to-pink-600", description: "Cria música e sons" },
    { id: 5, name: "Desenhar", icon: Palette, color: "from-yellow-400 to-yellow-600", description: "Desenha e pinta" },
    { id: 6, name: "Emoções", icon: Heart, color: "from-red-400 to-red-600", description: "Aprende sobre emoções" },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
          <p className="text-2xl text-purple-600 font-bold">A carregar...</p>
        </div>
      </div>
    )
  }

  if (!patient) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-4 md:p-8">
      {/* Header with Patient Info and Stats */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Patient Avatar and Name */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-3xl md:text-4xl font-bold overflow-hidden border-4 border-white shadow-lg">
                {patient.avatar_url ? (
                  <img src={patient.avatar_url} alt={patient.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{patient.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</span>
                )}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Olá, {patient.name.split(" ")[0]}! 👋
                </h1>
                <p className="text-lg text-gray-600 mt-1">Pronto para jogar?</p>
              </div>
            </div>

            {/* Gamification Stats */}
            <div className="flex gap-4">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-4 text-white text-center min-w-[100px] shadow-lg">
                <Star className="w-8 h-8 mx-auto mb-1" />
                <p className="text-2xl font-bold">{patient.points}</p>
                <p className="text-sm opacity-90">Pontos</p>
              </div>
              <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl p-4 text-white text-center min-w-[100px] shadow-lg">
                <Trophy className="w-8 h-8 mx-auto mb-1" />
                <p className="text-2xl font-bold">Nível {patient.level}</p>
                <p className="text-sm opacity-90">Super!</p>
              </div>
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-4 text-white text-center min-w-[100px] shadow-lg">
                <Zap className="w-8 h-8 mx-auto mb-1" />
                <p className="text-2xl font-bold">{patient.streak} dias</p>
                <p className="text-sm opacity-90">Sequência</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Escolhe um jogo! 🎮</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            const Icon = game.icon
            return (
              <button
                key={game.id}
                className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                onClick={() => {
                  // TODO: Navigate to game
                  alert(`Jogo "${game.name}" em breve!`)
                }}
              >
                <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{game.name}</h3>
                <p className="text-gray-600">{game.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Medal className="w-8 h-8 text-yellow-500" />
            As Tuas Conquistas 🏆
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Primeira Sessão", icon: "🌟", unlocked: true },
              { name: "7 Dias Seguidos", icon: "🔥", unlocked: true },
              { name: "100 Pontos", icon: "💯", unlocked: true },
              { name: "Mestre da Memória", icon: "🧠", unlocked: false },
            ].map((achievement, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl text-center transition-all ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-md"
                    : "bg-gray-100 opacity-50"
                }`}
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <p className="text-sm font-semibold text-gray-700">{achievement.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exit Button (Caregiver Access) */}
      <div className="max-w-7xl mx-auto mt-8 flex justify-center">
        <button
          onClick={handleExitToCaregiver}
          className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Voltar para Cuidador
        </button>
      </div>

      {/* PIN Verification Modal */}
      <PinModal
        isOpen={showExitPinModal}
        onClose={() => setShowExitPinModal(false)}
        onSuccess={handleExitPinSuccess}
        mode="verify"
        title="Verificar PIN"
        description="Introduz o PIN para voltar à área do cuidador"
        storedPin={storedPin || ""}
      />
    </div>
  )
}
