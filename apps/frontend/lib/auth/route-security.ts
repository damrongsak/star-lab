import type { UserRole } from "@star-lab/shared";

/**
 * Route access configuration
 * Maps route patterns to required roles
 */
const routeAccess: Record<string, UserRole[]> = {
  "/dashboard": ["CUSTOMER", "LAB_ADMIN", "TECHNICIAN", "DOCTOR", "ADMIN", "APPROVAL"], // Added LAB_ADMIN, TECHNICIAN, DOCTOR, ADMIN, APPROVAL
  "/lab-dashboard": ["LAB_ADMIN", "TECHNICIAN"],
  "/lab-requests": ["TECHNICIAN"],
  "/requests": ["CUSTOMER", "LAB_ADMIN", "TECHNICIAN", "ADMIN", "APPROVAL"],
  "/invoices": ["CUSTOMER", "LAB_ADMIN", "ADMIN", "APPROVAL"],
  "/profile": ["CUSTOMER", "LAB_ADMIN", "TECHNICIAN", "DOCTOR", "ADMIN", "APPROVAL"],
  "/lab": ["LAB_ADMIN", "TECHNICIAN"],
  "/doctor": ["DOCTOR"],
  "/admin": ["ADMIN"],
  "/users": ["ADMIN", "LAB_ADMIN"],
};

/**
 * Public routes that don't require authentication
 */
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
];

/**
 * Check if a route is public
 */
export function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Get required roles for a route
 */
export function getRequiredRoles(pathname: string): UserRole[] | null {
  for (const [route, roles] of Object.entries(routeAccess)) {
    if (pathname === route || pathname.startsWith(`${route}/`)) {
      return roles;
    }
  }
  return null;
}

/**
 * Checks if a user with a given role is allowed to access a specific pathname.
 * @param pathname The path the user is trying to access.
 * @param userRole The role of the authenticated user.
 * @returns True if the user is allowed, false otherwise.
 */
export function isRouteAllowed(pathname: string, userRole: UserRole): boolean {
  // Public routes are always allowed
  if (isPublicRoute(pathname)) {
    return true;
  }

  const requiredRoles = getRequiredRoles(pathname);

  // If no specific roles are required for the route, and it's not public,
  // then it means the route is protected but accessible by any authenticated user.
  // In our current setup, all non-public routes have explicit role configurations,
  // so this case might indicate a missing configuration or an implicit "authenticated only" route.
  // For now, we'll assume if requiredRoles is null, access is denied for safety.
  if (!requiredRoles) {
    return false;
  }

  // Check if the user's role is among the allowed roles for this route
  return requiredRoles.includes(userRole);
}
