'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Profile Page Error:", error)
  }, [error])
 
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
      <h2 className="text-xl font-semibold text-red-600">Something went wrong!</h2>
      <p className="text-muted-foreground">Unable to load profile information.</p>
      {process.env.NODE_ENV === 'development' && (
        <pre className="p-4 bg-slate-100 rounded text-xs text-red-500 overflow-auto max-w-full">
          {error.message}
        </pre>
      )}
      <Button
        variant="outline"
        onClick={() => reset()}
      >
        Try again
      </Button>
    </div>
  )
}
