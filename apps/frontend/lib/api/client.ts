import axios, { AxiosError } from "axios"

/**
 * Helper to get cookie value
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const nameEQ = name + "="
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

/**
 * Helper to delete cookie
 */
function deleteCookie(name: string) {
  if (typeof document !== "undefined") {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
  }
}

/**
 * API Error response interface
 * Matches the backend error response format from errorHandler.ts
 */
export interface ApiError {
  success: false
  message: string
  error?: {
    code: string
    details: unknown
  }
}

/**
 * Base URL for API requests
 * Reads from environment variable or defaults to local backend
 */
const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1"

/**
 * Axios instance configured for the STAR-LAB API
 * Includes automatic token injection and error handling
 */
export const apiClient = axios.create({
  baseURL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
})

/**
 * Request interceptor
 * Automatically adds JWT token to Authorization header if available
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from cookie (if available in browser)
    if (typeof window !== "undefined") {
      const token = getCookie("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor
 * Handles 401 errors by clearing token and redirecting to login
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return successful response
    return response
  },
  (error: AxiosError<ApiError>) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear token from cookie
      if (typeof window !== "undefined") {
        deleteCookie("token")
        // Redirect to login page
        window.location.href = "/login"
      }
    }

    // Return error with data or message
    return Promise.reject(error.response?.data || error.message)
  }
)

/**
 * Helper function to extract error message from API error
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error
  if (error && typeof error === "object" && "message" in error) {
    return (error as ApiError).message
  }
  return "An unexpected error occurred"
}
