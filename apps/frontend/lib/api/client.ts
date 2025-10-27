import axios, { AxiosError } from "axios"

/**
 * API Error response interface
 * Matches the backend error response format from errorHandler.ts
 */
export interface ApiError {
  success: false
  message: string
  error?: {
    code: string
    details: any
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
    // Get token from localStorage (if available in browser)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
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
      // Clear token from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
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
