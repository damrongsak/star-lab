import React, { useEffect } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { ThemeProvider } from "./context/theme-provider";
import { UserProvider, useUser } from "./context/user-context";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import { ToastProvider, useToast } from "./components/ui/use-toast";

import type { Route } from "./+types/root";
import "./app.css";
import { useMemo as reactUseMemo } from "react";

// Define the structure for a user's profile, specifically for their role.
interface UserProfile {
  id: string;
  role:
    | "ADMIN"
    | "LAB_ADMIN"
    | "CUSTOMER"
    | "TECHNICIAN"
    | "DOCTOR"
    | "APPROVAL"
    | null;
  email: string;
}

// Default guest user profile
const GUEST_USER: UserProfile = {
  id: "guest",
  role: null,
  email: "",
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function AppContent() {
  const userProfile = useMemo(() => getUserProfile(), []);
  const { setUser } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    setUser(userProfile);
    // Optionally show a toast for guests or users
    if (!userProfile.id || userProfile.id === "guest") {
      toast({ title: "Welcome!", description: "You are browsing as a guest." });
    }
  }, [userProfile, setUser, toast]);

  const isLabRoute =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/lab") &&
    userProfile.role;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {isLabRoute && <Sidebar />}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/50">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}

// RootLayout Component
export default function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

// Helper to get user profile from localStorage or fallback to guest
function getUserProfile(): UserProfile {
  if (typeof window === "undefined") return GUEST_USER;
  const storedUser = localStorage.getItem("mockUser");
  if (storedUser) {
    try {
      const userProfile = JSON.parse(storedUser) as UserProfile;
      if (
        userProfile &&
        userProfile.id &&
        typeof userProfile.role !== "undefined" &&
        typeof userProfile.email === "string"
      ) {
        return userProfile;
      }
    } catch (e) {
      // ignore parse errors, fallback to guest
    }
  }
  return GUEST_USER;
}
function useMemo<T>(factory: () => T, deps: React.DependencyList): T {
  return reactUseMemo(factory, deps);
}
