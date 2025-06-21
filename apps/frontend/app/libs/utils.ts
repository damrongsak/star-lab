import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
