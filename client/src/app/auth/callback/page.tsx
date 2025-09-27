"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth callback error:', error)
          router.push(`/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)
          return
        }
        if (data.session) {
          console.log('Authentication successful for user:', data.session.user.email)
          router.push('/')
        } else {
          console.log('No session found, redirecting to login')
          router.push('/login')
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err)
        router.push('/auth/auth-code-error?error=Authentication failed')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}