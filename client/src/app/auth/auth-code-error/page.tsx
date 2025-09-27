"use client"

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="text-muted-foreground mb-4">
          There was an error during the authentication process.
        </p>
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md p-3 mb-4">
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>Error:</strong> {decodeURIComponent(error)}
            </p>
          </div>
        )}
        <div className="space-y-2">
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 w-full"
          >
            Try Again
          </a>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground w-full"
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  )
}

export default function AuthCodeError() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  )
}