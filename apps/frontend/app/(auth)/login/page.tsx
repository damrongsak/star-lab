"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { customerLoginSchema } from "@star-lab/shared"
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type LoginFormValues = z.infer<typeof customerLoginSchema>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState<boolean>(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(customerLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  })

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const storedRemember = localStorage.getItem("rememberMe") === "true"
    const storedEmail = localStorage.getItem("loginEmail")

    setRememberMe(storedRemember)

    if (storedRemember && storedEmail) {
      form.setValue("email", storedEmail)
    }
  }, [form])

  const handleRememberPreference = (checked: boolean) => {
    setRememberMe(checked)

    if (typeof window !== "undefined") {
      localStorage.setItem("rememberMe", checked ? "true" : "false")

      if (!checked) {
        localStorage.removeItem("loginEmail")
      }
    }
  }

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    setErrorMessage(null)

    try {
      await login(values.email, values.password)

      if (typeof window !== "undefined") {
        localStorage.setItem("rememberMe", rememberMe ? "true" : "false")

        if (rememberMe) {
          localStorage.setItem("loginEmail", values.email)
        } else {
          localStorage.removeItem("loginEmail")
        }
      }

      const redirect = searchParams.get("redirect")
      const targetUrl = redirect || "/dashboard"

      // Force a full page navigation
      window.location.href = targetUrl
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again."
      setErrorMessage(message)
    }
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-md border border-border shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-semibold">STAR-LAB Login</CardTitle>
          <CardDescription>
            Welcome back. Sign in with your email and password to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <div
              className="mb-6 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              role="alert"
              aria-live="polite"
            >
              {errorMessage}
            </div>
          )}
          <Form {...form}>
            <form
              className="space-y-6"
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link
                        className="text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:underline"
                        href="/forgot-password"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      handleRememberPreference(checked === true)
                    }
                    disabled={isSubmitting}
                  />
                  <Label
                    htmlFor="remember-me"
                    className="text-sm text-muted-foreground"
                  >
                    Remember me
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Secure session enabled
                </p>
              </div>

              <Button
                className="w-full"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2
                      aria-hidden="true"
                      className="mr-2 h-4 w-4 animate-spin"
                    />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              className="font-medium text-primary underline-offset-4 hover:underline focus-visible:underline"
              href="/register"
            >
              Register here
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            By signing in you agree to our{" "}
            <Link
              className="underline underline-offset-4 hover:text-primary"
              href="/terms"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              className="underline underline-offset-4 hover:text-primary"
              href="/privacy"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <Card className="w-full max-w-md shadow-xl border border-border">
          <CardContent className="flex items-center justify-center pt-12 pb-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </main>
    }>
      <LoginForm />
    </Suspense>
  )
}
