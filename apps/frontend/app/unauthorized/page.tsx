import type { Metadata } from "next"
import Link from "next/link"
import { ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Unauthorized - STAR-LAB",
}

const UnauthorizedPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-xl border-border shadow-lg">
        <CardHeader className="items-center gap-4 text-center">
          <span className="rounded-full bg-destructive/10 p-4">
            <ShieldAlert
              aria-hidden="true"
              className="h-14 w-14 text-destructive"
            />
          </span>
          <CardTitle className="text-3xl font-semibold text-foreground">
            403 - Unauthorized
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            You do not have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Please contact your administrator if you believe this is an error.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            asChild
            variant="destructive"
          >
            <Link href="/">Go to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

export default UnauthorizedPage
