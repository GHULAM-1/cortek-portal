"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, LoginResponse } from '@/types/users/users-types'
import { useAuthStore } from '@/store/auth-store'
import axios from 'axios'

interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  signOutUser: () => Promise<void>
  checkUserAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isAuthenticated, setUser, clearUser } = useAuthStore()
  const [loading, setLoading] = useState(true)

  // Check user auth on mount with delay for store hydration
  useEffect(() => {
    const timer = setTimeout(() => {
      checkUserAuth()
    }, 100) // Small delay to allow Zustand persist to hydrate

    return () => clearTimeout(timer)
  }, [])

  const checkUserAuth = async () => {
    try {
      if (user) {
        console.log('User is authenticated', user)
      } else {
        console.log('No user found in store')
        // Don't clearUser() here as store might still be hydrating
      }
    } catch (error) {
      console.log('User is not authenticated', error)
      clearUser()
    } finally {
      setLoading(false)
    }
  }


  const signOutUser = async () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

    try {
      await axios.post(`${API_BASE_URL}/users/signout`, {}, {
        withCredentials: true,
      })

      clearUser()
    } catch (error) {
      console.error('User logout error:', error)
    } finally {
      clearUser()
      router.push('/auth/login')
    }
  }


  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    signOutUser,
    checkUserAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}