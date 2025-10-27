"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { jwtDecode } from "jwt-decode"
import { apiClient, getErrorMessage } from "../api/client"
import type { User, UserRole } from "@star-lab/shared"

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
  login: (email: string, password: string) => Promise<void>
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
   * Load token from localStorage on mount
   */
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("token")
        if (storedToken) {
          // Decode JWT to get user info
          const decoded = jwtDecode<JWTPayload>(storedToken)

          // Check if token is expired
          const isExpired = decoded.exp * 1000 < Date.now()
          if (isExpired) {
            // Token expired, remove it
            localStorage.removeItem("token")
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
        localStorage.removeItem("token")
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
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true)

      // Call login API
      const response = await apiClient.post("/auth/login", { email, password })
      const { token: newToken } = response.data

      // Store token in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", newToken)
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
    // Clear token from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
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
      // Store token in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", newToken)
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
