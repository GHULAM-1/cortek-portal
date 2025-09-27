"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, publicApi } from '@/lib/api-wrapper'
import { User, LoginResponse } from '@/types/users/users-types'

interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  signInUser: (email: string, password: string) => Promise<void>
  signOutUser: () => Promise<void>
  checkUserAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  })
  // Check user auth on mount
  useEffect(() => {
    checkUserAuth()
  }, [])

  const checkUserAuth = async () => {
    try {
      // Use API wrapper to check authentication and get current user
      const currentUser = api.getCurrentUser()
      if (currentUser) {
        console.log('User is authenticated', currentUser)
        setAuthState(prev => ({
          ...prev,
          user: currentUser,
          isAuthenticated: true,
          loading: false,
        }))
      } else {
        setAuthState(prev => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          loading: false,
        }))
      }
    } catch (error) {
      console.log('User is not authenticated', error)
      setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        loading: false,
      }))
    }
  }

  const signInUser = async (email: string, password: string) => {
    try {
      const response = await publicApi.post<LoginResponse>('/users/login', { email, password })

      // Manually save user to localStorage since we're using publicApi
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(response.user))
      }

      setAuthState(prev => ({
        ...prev,
        user: response.user,
        isAuthenticated: true,
      }))
      console.log('User is authenticated in signInUser', response.user)
      router.push('/dashboard')
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
      }))
      console.log('User is not authenticated in signInUser', error)
      throw error
    }
  }

  const signOutUser = async () => {
    try {
      await publicApi.post('/users/signout')
      publicApi.clearUser() // Clear user from API wrapper and localStorage
    } catch (error) {
      console.error('User logout error:', error)
    } finally {
      setAuthState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
      }))
    }
  }


  const value: AuthContextType = {
    ...authState,
    signInUser,
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