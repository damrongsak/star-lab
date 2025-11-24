import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import type { UserRole } from "@star-lab/shared";
import { isPublicRoute, isRouteAllowed } from "@/lib/auth/route-security";

/**
 * JWT Payload interface
 */
interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  exp: number;
}

/**
 * Middleware function
 * Protects routes based on authentication and role
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Get token from cookie or localStorage (via cookie)
  const token = request.cookies.get("token")?.value;

  // No token - redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Decode JWT to get user role
    const decoded = jwtDecode<JWTPayload>(token);

    // Check if token is expired
    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if the user's role is allowed for this route
    if (!isRouteAllowed(pathname, decoded.role)) {
      // User doesn't have required role - redirect to unauthorized or their home
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }

    // User is authorized
    return NextResponse.next();
  } catch (error) {
    // Invalid token - redirect to login
    console.error("Middleware JWT decode error:", error);
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
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
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)"
  ]
};
