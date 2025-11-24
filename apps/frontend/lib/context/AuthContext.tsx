"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { jwtDecode } from "jwt-decode"
import { apiClient, getErrorMessage } from "../api/client"
import type { User, UserRole } from "@star-lab/shared"

/**
 * Cookie helper functions
 */
function setCookie(name: string, value: string, days: number) {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`
}

function getCookie(name: string): string | null {
  const nameEQ = name + "="
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

/**
 * JWT Payload interface
 * Matches the token payload from backend jwt.ts
 */
interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  exp: number
}

/**
 * Auth Context interface
 */
interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => void
  setToken: (token: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider component
 * Provides authentication state and methods to the application
 *
 * @param {ReactNode} children - Child components
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  /**
   * Load token from cookies on mount
   */
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        // Get token from cookie
        const storedToken = getCookie("token")
        if (storedToken) {
          // Decode JWT to get user info
          const decoded = jwtDecode<JWTPayload>(storedToken)

          // Check if token is expired
          const isExpired = decoded.exp * 1000 < Date.now()
          if (isExpired) {
            // Token expired, remove it
            deleteCookie("token")
            setTokenState(null)
            setUser(null)
          } else {
            // Token valid, set user info
            setTokenState(storedToken)
            setUser({
              id: decoded.userId,
              email: decoded.email,
              role: decoded.role,
            } as User)
          }
        }
      }
    } catch (error) {
      console.error("Error loading auth token:", error)
      // Invalid token, clear it
      if (typeof window !== "undefined") {
        deleteCookie("token")
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Login function
   * Authenticates user and stores token
   *
   * @param {string} email - User email
   * @param {string} password - User password
   * @throws {Error} If login fails
   * @returns {Promise<User>} Authenticated user object
   */
  const login = async (email: string, password: string): Promise<User> => {
    try {
      setIsLoading(true)

      // Call login API
      const response = await apiClient.post("/auth/login", { email, password })
      const { token: newToken } = response.data

      if (!newToken) {
        throw new Error("No token received from server")
      }

      // Store token in cookie (30 days expiration)
      if (typeof window !== "undefined") {
        setCookie("token", newToken, 30)
      }

      // Decode token to get user info
      const decoded = jwtDecode<JWTPayload>(newToken)

      const userObj = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      } as User

      // Set user state
      setTokenState(newToken)
      setUser(userObj)

      return userObj
    } catch (error) {
      console.error("Login error:", error)
      throw new Error(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Logout function
   * Clears authentication state and redirects to login
   */
  const logout = (): void => {
    // Clear token from cookie
    if (typeof window !== "undefined") {
      deleteCookie("token")
    }

    // Reset state
    setTokenState(null)
    setUser(null)

    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
  }

  /**
   * Set token function
   * Manually set token (useful for registration flow)
   *
   * @param {string} newToken - JWT token
   */
  const setToken = (newToken: string): void => {
    try {
      // Store token in cookie
      if (typeof window !== "undefined") {
        setCookie("token", newToken, 30)
      }

      // Decode token to get user info
      const decoded = jwtDecode<JWTPayload>(newToken)

      // Set user state
      setTokenState(newToken)
      setUser({
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      } as User)
    } catch (error) {
      console.error("Error setting token:", error)
      throw new Error("Invalid token")
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    setToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth hook
 * Access authentication context
 *
 * @throws {Error} If used outside AuthProvider
 * @returns {AuthContextType} Authentication context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
