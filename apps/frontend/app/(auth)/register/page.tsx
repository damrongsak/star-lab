"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { customerRegistrationSchema } from "@star-lab/shared"
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
import { Textarea } from "@/components/ui/textarea"

// Extended schema that includes confirmPassword field
const registrationFormSchema = customerRegistrationSchema
  .extend({
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type RegistrationFormValues = z.infer<typeof registrationFormSchema>

type PasswordStrength = {
  label: string
  meterClass: string
  percentage: number
}

const passwordStrengthLevels = (password: string): PasswordStrength => {
  if (!password) {
    return {
      label: "Enter a password",
      meterClass: "bg-muted",
      percentage: 0,
    }
  }

  let score = 0
  if (password.length >= 8) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[a-z]/.test(password) && /[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  switch (score) {
    case 4:
      return { label: "Strong", meterClass: "bg-emerald-500", percentage: 100 }
    case 3:
      return { label: "Good", meterClass: "bg-green-500", percentage: 75 }
    case 2:
      return { label: "Fair", meterClass: "bg-amber-500", percentage: 50 }
    case 1:
      return { label: "Weak", meterClass: "bg-orange-500", percentage: 25 }
    default:
      return { label: "Too weak", meterClass: "bg-destructive", percentage: 10 }
  }
}

const RegisterPage = () => {
  const router = useRouter()
  const { setToken } = useAuth()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [shippingSameAsBilling, setShippingSameAsBilling] = useState<boolean>(
    true,
  )

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      taxIdOrIdCard: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      shippingAddressLine1: "",
      shippingAddressLine2: "",
      shippingCity: "",
      shippingState: "",
      shippingZipCode: "",
      shippingCountry: "",
    },
  })

  const isSubmitting = form.formState.isSubmitting
  const passwordValue = form.watch("password")

  const passwordStrength = useMemo(
    () => passwordStrengthLevels(passwordValue),
    [passwordValue],
  )

  const handleShippingToggle = (checked: boolean) => {
    setShippingSameAsBilling(checked)
    if (checked) {
      const {
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        country,
      } = form.getValues()

      form.setValue("shippingAddressLine1", addressLine1 ?? "")
      form.setValue("shippingAddressLine2", addressLine2 ?? "")
      form.setValue("shippingCity", city ?? "")
      form.setValue("shippingState", state ?? "")
      form.setValue("shippingZipCode", zipCode ?? "")
      form.setValue("shippingCountry", country ?? "")
    } else {
      form.setValue("shippingAddressLine1", "")
      form.setValue("shippingAddressLine2", "")
      form.setValue("shippingCity", "")
      form.setValue("shippingState", "")
      form.setValue("shippingZipCode", "")
      form.setValue("shippingCountry", "")
    }
  }

  const onSubmit = async (
    values: RegistrationFormValues,
  ): Promise<void> => {
    setErrorMessage(null)
    setSuccessMessage(null)

    // Remove confirmPassword before sending to API
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registrationData } = values

    const payload = shippingSameAsBilling
      ? {
          ...registrationData,
          shippingAddressLine1: values.addressLine1,
          shippingAddressLine2: values.addressLine2,
          shippingCity: values.city,
          shippingState: values.state,
          shippingZipCode: values.zipCode,
          shippingCountry: values.country,
        }
      : registrationData

    try {
      const response = await apiClient.post("/auth/register", payload)

      setSuccessMessage(
        "Registration successful! Please check your email to verify your account.",
      )

      const token = (response.data as { token?: string })?.token

      if (token) {
        setToken(token)
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        setTimeout(() => {
          router.push("/login?registered=1")
        }, 1500)
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-16">
      <Card className="w-full max-w-[600px] border border-slate-200 shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-semibold">
            Create your STAR-LAB account
          </CardTitle>
          <CardDescription>
            Provide your company and billing details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {successMessage && (
            <div
              className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              role="status"
              aria-live="polite"
            >
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div
              className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              role="alert"
              aria-live="assertive"
            >
              {errorMessage}
            </div>
          )}
          <Form {...form}>
            <form
              className="space-y-8"
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <section
                aria-labelledby="account-information-heading"
                className="space-y-4"
              >
                <div className="space-y-1">
                  <h2
                    id="account-information-heading"
                    className="text-lg font-semibold text-slate-900"
                  >
                    Account Information
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ll use these details to create your secure STAR-LAB
                    account.
                  </p>
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email address{" "}
                          <span
                            aria-hidden="true"
                            className="text-destructive"
                          >
                            *
                          </span>
                          <span className="sr-only">Required</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
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
                        <FormLabel>
                          Password{" "}
                          <span
                            aria-hidden="true"
                            className="text-destructive"
                          >
                            *
                          </span>
                          <span className="sr-only">Required</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter a strong password"
                            autoComplete="new-password"
                            disabled={isSubmitting}
                            onChange={(event) => {
                              field.onChange(event)
                              if (form.formState.errors.confirmPassword) {
                                form.clearErrors("confirmPassword")
                              }
                            }}
                          />
                        </FormControl>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Password strength</span>
                            <span
                              className="font-medium text-slate-700"
                              aria-live="polite"
                            >
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-200">
                            <div
                              className={`h-2 rounded-full transition-all ${passwordStrength.meterClass}`}
                              style={{ width: `${passwordStrength.percentage}%` }}
                              aria-hidden="true"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Use at least 8 characters, including uppercase,
                            lowercase, numbers, and symbols.
                          </p>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Confirm password{" "}
                          <span
                            aria-hidden="true"
                            className="text-destructive"
                          >
                            *
                          </span>
                          <span className="sr-only">Required</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Re-enter your password"
                            autoComplete="new-password"
                            disabled={isSubmitting}
                            onChange={(event) => {
                              field.onChange(event)
                              if (form.formState.errors.confirmPassword) {
                                form.clearErrors("confirmPassword")
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <section
                aria-labelledby="company-information-heading"
                className="space-y-4 border-t border-slate-200 pt-6"
              >
                <div className="space-y-1">
                  <h2
                    id="company-information-heading"
                    className="text-lg font-semibold text-slate-900"
                  >
                    Company Information
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Tell us a bit about your organisation for billing and
                    onboarding.
                  </p>
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Company name{" "}
                          <span
                            aria-hidden="true"
                            className="text-destructive"
                          >
                            *
                          </span>
                          <span className="sr-only">Required</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Your company LLC"
                            autoComplete="organization"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="taxIdOrIdCard"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID / ID card</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Optional tax identification"
                            autoComplete="tax-id"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <section
                aria-labelledby="billing-address-heading"
                className="space-y-4 border-t border-slate-200 pt-6"
              >
                <div className="space-y-1">
                  <h2
                    id="billing-address-heading"
                    className="text-lg font-semibold text-slate-900"
                  >
                    Billing Address
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ll send invoices and receipts to this address.
                  </p>
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Address line 1{" "}
                          <span
                            aria-hidden="true"
                            className="text-destructive"
                          >
                            *
                          </span>
                          <span className="sr-only">Required</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Street address, P.O. box, company name"
                            autoComplete="address-line1"
                            disabled={isSubmitting}
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address line 2</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Apartment, suite, unit, building"
                            autoComplete="address-line2"
                            disabled={isSubmitting}
                            rows={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            City{" "}
                            <span
                              aria-hidden="true"
                              className="text-destructive"
                            >
                              *
                            </span>
                            <span className="sr-only">Required</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="City"
                              autoComplete="address-level2"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State / Province</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="State or province"
                              autoComplete="address-level1"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal code</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Postal code"
                              autoComplete="postal-code"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Country{" "}
                          <span
                            aria-hidden="true"
                            className="text-destructive"
                          >
                            *
                          </span>
                          <span className="sr-only">Required</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Country"
                            autoComplete="country-name"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <section
                aria-labelledby="shipping-address-heading"
                className="space-y-4 border-t border-slate-200 pt-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <h2
                      id="shipping-address-heading"
                      className="text-lg font-semibold text-slate-900"
                    >
                      Shipping Address
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Let us know where to send physical materials or kits.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 rounded-md border border-slate-200 bg-white px-3 py-2">
                    <Checkbox
                      id="shipping-same"
                      checked={shippingSameAsBilling}
                      onCheckedChange={(checked) =>
                        handleShippingToggle(checked === true)
                      }
                      disabled={isSubmitting}
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor="shipping-same"
                        className="text-sm font-medium text-slate-900"
                      >
                        Shipping address same as billing
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Uncheck to enter a different shipping address.
                      </p>
                    </div>
                  </div>
                </div>

                {!shippingSameAsBilling && (
                  <div
                    aria-live="polite"
                    className="space-y-4"
                    role="group"
                  >
                    <FormField
                      control={form.control}
                      name="shippingAddressLine1"
                      rules={
                        shippingSameAsBilling
                          ? undefined
                          : { required: "Shipping address is required" }
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Shipping address line 1{" "}
                            <span
                              aria-hidden="true"
                              className="text-destructive"
                            >
                              *
                            </span>
                            <span className="sr-only">Required</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Street address, P.O. box, company name"
                              autoComplete="shipping address-line1"
                              disabled={isSubmitting}
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shippingAddressLine2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shipping address line 2</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Apartment, suite, unit, building"
                              autoComplete="shipping address-line2"
                              disabled={isSubmitting}
                              rows={2}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid gap-4 sm:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="shippingCity"
                        rules={
                          shippingSameAsBilling
                            ? undefined
                            : { required: "Shipping city is required" }
                        }
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              City{" "}
                              <span
                                aria-hidden="true"
                                className="text-destructive"
                              >
                                *
                              </span>
                              <span className="sr-only">Required</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="City"
                                autoComplete="shipping address-level2"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shippingState"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State / Province</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="State or province"
                                autoComplete="shipping address-level1"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shippingZipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal code</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Postal code"
                                autoComplete="shipping postal-code"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="shippingCountry"
                      rules={
                        shippingSameAsBilling
                          ? undefined
                          : { required: "Shipping country is required" }
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Country{" "}
                            <span
                              aria-hidden="true"
                              className="text-destructive"
                            >
                              *
                            </span>
                            <span className="sr-only">Required</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Country"
                              autoComplete="shipping country-name"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </section>

              <div className="space-y-4 pt-4">
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
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  By creating an account, you agree to our{" "}
                  <Link
                    className="font-medium text-primary underline-offset-4 hover:underline focus-visible:underline"
                    href="/terms"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    className="font-medium text-primary underline-offset-4 hover:underline focus-visible:underline"
                    href="/privacy"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              className="font-medium text-primary underline-offset-4 hover:underline focus-visible:underline"
              href="/login"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}

export default RegisterPage
