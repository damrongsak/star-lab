"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";


import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        if (user.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          // Redirect other authenticated users to their general dashboard
          router.push("/dashboard");
        }
      } else {
        // Redirect unauthenticated users to login
        router.push("/login");
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening in your workspace today.</p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Projects", value: "12" },
          { label: "Open Tasks", value: "58" },
          { label: "Team Members", value: "24" },
          { label: "Uptime", value: "99.98%" },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-card-foreground">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-medium text-card-foreground">Recent Activity</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• Deployed backend v1.2.4 to production</li>
            <li>• Added OAuth support to the API</li>
            <li>• Fixed flaky Jest tests in database-service</li>
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h2 className="text-sm font-medium text-card-foreground">Shortcuts</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {[
              "New Project",
              "Invite Team",
              "View Logs",
              "Docs",
            ].map((s) => (
              <Button key={s} variant="outline" className="justify-start">
                {s}
              </Button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
