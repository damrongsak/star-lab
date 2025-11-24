import { isPublicRoute, getRequiredRoles, isRouteAllowed } from "../route-security";
import type { UserRole } from "@star-lab/shared";

describe("route-security", () => {
  describe("isPublicRoute", () => {
    test("should return true for public routes", () => {
      expect(isPublicRoute("/")).toBe(true);
      expect(isPublicRoute("/login")).toBe(true);
      expect(isPublicRoute("/register")).toBe(true);
      expect(isPublicRoute("/verify-email")).toBe(true);
      expect(isPublicRoute("/forgot-password")).toBe(true);
      expect(isPublicRoute("/login/some-path")).toBe(true); // Test with sub-path
    });

    test("should return false for non-public routes", () => {
      expect(isPublicRoute("/dashboard")).toBe(false);
      expect(isPublicRoute("/profile")).toBe(false);
      expect(isPublicRoute("/lab/test")).toBe(false);
    });
  });

  describe("getRequiredRoles", () => {
    test("should return correct roles for configured routes", () => {
      expect(getRequiredRoles("/dashboard")).toEqual(["CUSTOMER", "LAB_ADMIN", "TECHNICIAN", "DOCTOR", "ADMIN", "APPROVAL"]);
      expect(getRequiredRoles("/lab")).toEqual(["LAB_ADMIN", "TECHNICIAN"]);
      expect(getRequiredRoles("/admin")).toEqual(["ADMIN"]);
      expect(getRequiredRoles("/profile")).toEqual(["CUSTOMER", "LAB_ADMIN", "TECHNICIAN", "DOCTOR", "ADMIN", "APPROVAL"]);
    });

    test("should return null for unconfigured routes", () => {
      expect(getRequiredRoles("/unknown-route")).toBeNull();
      expect(getRequiredRoles("/api/v1/auth/login")).toBeNull(); // API routes are not handled by this config
    });

    test("should return roles for sub-paths", () => {
      expect(getRequiredRoles("/lab/some-id/edit")).toEqual(["LAB_ADMIN", "TECHNICIAN"]);
    });
  });

  describe("isRouteAllowed", () => {
    test("should allow access for public routes regardless of role", () => {
      expect(isRouteAllowed("/login", "CUSTOMER")).toBe(true);
      expect(isRouteAllowed("/", "ADMIN")).toBe(true);
      expect(isRouteAllowed("/register", "LAB_ADMIN")).toBe(true);
    });

    test("should allow access when user has a required role", () => {
      expect(isRouteAllowed("/dashboard", "LAB_ADMIN")).toBe(true);
      expect(isRouteAllowed("/dashboard", "CUSTOMER")).toBe(true);
      expect(isRouteAllowed("/lab", "TECHNICIAN")).toBe(true);
      expect(isRouteAllowed("/admin", "ADMIN")).toBe(true);
      expect(isRouteAllowed("/profile", "DOCTOR")).toBe(true);
    });

    test("should deny access when user lacks a required role", () => {
      expect(isRouteAllowed("/dashboard", "ADMIN")).toBe(true); // Should be allowed now
      expect(isRouteAllowed("/lab", "CUSTOMER")).toBe(false);
      expect(isRouteAllowed("/admin", "LAB_ADMIN")).toBe(false);
      expect(isRouteAllowed("/doctor", "TECHNICIAN")).toBe(false);
    });

    test("should deny access for unconfigured routes (not public) for any role", () => {
      expect(isRouteAllowed("/some-protected-route", "CUSTOMER")).toBe(false);
      expect(isRouteAllowed("/another-secret-page", "ADMIN")).toBe(false);
    });
  });
});
