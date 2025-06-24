// --- app/libs/utils.ts ---
// General utility functions.
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useMemo as reactUseMemo } from "react";
import { type UserProfile } from "~/context/user-context"; // Import UserProfile from user-context

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely redirects to a given path or falls back to a default redirect.
 * @param to - The path to redirect to, can be a string or any other type.
 * @param defaultRedirect - The default path to redirect to if `to` is not valid.
 * @returns A valid redirect path.
 */
export function safeRedirect(to: unknown, defaultRedirect: string): string {
  if (typeof to === "string" && to.startsWith("/")) {
    return to;
  }
  return defaultRedirect;
}

// Default guest user profile
export const GUEST_USER: UserProfile = {
  id: "guest",
  role: "GUEST",
  email: "guest@orignx.dev",
};

// Helper to get user profile from localStorage or fallback to guest
export function getUserProfile(): UserProfile {
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

// Re-export useMemo with a clear name
export function useMemo<T>(factory: () => T, deps: React.DependencyList): T {
  return reactUseMemo(factory, deps);
}
