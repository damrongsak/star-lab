"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, Loader2, XCircle } from "lucide-react"

import { apiClient, getErrorMessage } from "@/lib/api/client"
import { useAuth } from "@/lib/context/AuthContext"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type VerificationStatus = "loading" | "success" | "error"

interface VerifyEmailResponse {
  message: string
  token?: string
}

function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const { setToken } = useAuth()

  const [status, setStatus] = useState<VerificationStatus>(token ? "loading" : "error")
  const [statusMessage, setStatusMessage] = useState<string>(
    token ? "Verifying your email address..." : "We couldn't verify your email."
  )
  const [errorDetail, setErrorDetail] = useState<string | null>(
    token ? null : "Invalid verification link. Please request a new one."
  )
  const [countdown, setCountdown] = useState<number>(3)
  const hasAttemptedVerification = useRef<boolean>(false)

  useEffect(() => {
    if (!token || hasAttemptedVerification.current) {
      return
    }
    hasAttemptedVerification.current = true

    const verifyEmail = async (): Promise<void> => {
      try {
        setStatus("loading")
        setStatusMessage("Verifying your email address...")
        setErrorDetail(null)

        const response = await apiClient.post<VerifyEmailResponse>(
          "/auth/verify-email",
          { token }
        )

        const successMessage =
          response.data?.message || "Your email has been verified successfully."

        if (response.data?.token) {
          setToken(response.data.token)
        }

        setStatus("success")
        setStatusMessage(successMessage)
        setErrorDetail(null)
      } catch (error) {
        const message =
          getErrorMessage(error) || "Invalid or expired verification token."
        setStatus("error")
        setStatusMessage("We couldn't verify your email.")
        setErrorDetail(message)
      }
    }

    void verifyEmail()
  }, [token, setToken])

  useEffect(() => {
    if (status !== "success") {
      return
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCountdown(3)
    const intervalId = window.setInterval(() => {
      setCountdown((previous) => {
        if (previous <= 1) {
          window.clearInterval(intervalId)
          router.push("/dashboard")
          return 0
        }
        return previous - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [status, router])

  const renderIcon = () => {
    if (status === "success") {
      return (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle
            aria-hidden="true"
            className="h-12 w-12 text-emerald-500"
          />
        </div>
      )
    }

    if (status === "error") {
      return (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <XCircle aria-hidden="true" className="h-12 w-12 text-destructive" />
        </div>
      )
    }

    return (
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Loader2 aria-hidden="true" className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-16">
      <Card className="w-full max-w-lg border border-slate-200 shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto">{renderIcon()}</div>
          <CardTitle className="text-3xl font-semibold">
            {status === "success"
              ? "Email Verified!"
              : status === "error"
              ? "Verification Failed"
              : "Verify Email"}
          </CardTitle>
          <CardDescription
            aria-live="polite"
            role="status"
            className="text-base"
          >
            {statusMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          {status === "loading" && (
            <p className="text-sm text-muted-foreground">
              This may take a moment. Please hold tight while we confirm your email.
            </p>
          )}

          {status === "success" && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                You will be redirected to your dashboard in{" "}
                <span className="font-semibold">{countdown}</span>{" "}
                {countdown === 1 ? "second" : "seconds"}.
              </p>
            </div>
          )}

          {status === "error" && errorDetail && (
            <div
              aria-live="assertive"
              className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {errorDetail}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {status === "success" && (
            <Button onClick={() => router.push("/dashboard")} size="lg">
              Go to Dashboard
            </Button>
          )}

          {status === "error" && (
            <>
              <Button onClick={() => router.push("/login")} size="lg">
                Back to Login
              </Button>
              <Button
                onClick={() => router.push("/register")}
                size="lg"
                variant="outline"
              >
                Resend Verification Email
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </main>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-white px-4 py-12">
        <Card className="w-full max-w-lg shadow-xl">
          <CardContent className="flex items-center justify-center pt-12 pb-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </CardContent>
        </Card>
      </main>
    }>
      <VerifyEmailForm />
    </Suspense>
  )
}
