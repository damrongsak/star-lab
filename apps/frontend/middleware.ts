import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtDecode } from "jwt-decode"
import type { UserRole } from "@star-lab/shared"

/**
 * JWT Payload interface
 */
interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  exp: number
}

/**
 * Route access configuration
 * Maps route patterns to required roles
 */
const routeAccess: Record<string, UserRole[]> = {
  "/dashboard": ["CUSTOMER"],
  "/requests": ["CUSTOMER"],
  "/profile": ["CUSTOMER", "LAB_ADMIN", "TECHNICIAN", "DOCTOR", "ADMIN", "APPROVAL"],
  "/lab": ["LAB_ADMIN", "TECHNICIAN"],
  "/doctor": ["DOCTOR"],
  "/admin": ["ADMIN"],
  "/users": ["ADMIN", "LAB_ADMIN"],
}

/**
 * Public routes that don't require authentication
 */
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
]

/**
 * Check if a route is public
 */
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}

/**
 * Get required roles for a route
 */
function getRequiredRoles(pathname: string): UserRole[] | null {
  for (const [route, roles] of Object.entries(routeAccess)) {
    if (pathname === route || pathname.startsWith(`${route}/`)) {
      return roles
    }
  }
  return null
}

/**
 * Middleware function
 * Protects routes based on authentication and role
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Get token from cookie or localStorage (via cookie)
  const token = request.cookies.get("token")?.value

  // No token - redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    // Decode JWT to get user role
    const decoded = jwtDecode<JWTPayload>(token)

    // Check if token is expired
    const isExpired = decoded.exp * 1000 < Date.now()
    if (isExpired) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Get required roles for this route
    const requiredRoles = getRequiredRoles(pathname)

    // If route requires specific roles, check user role
    if (requiredRoles && !requiredRoles.includes(decoded.role)) {
      // User doesn't have required role - redirect to unauthorized or their home
      const unauthorizedUrl = new URL("/unauthorized", request.url)
      return NextResponse.redirect(unauthorizedUrl)
    }

    // User is authorized
    return NextResponse.next()
  } catch (error) {
    // Invalid token - redirect to login
    console.error("Middleware JWT decode error:", error)
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }
}

/**
 * Middleware configuration
 * Specify which routes to apply middleware to
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
}
