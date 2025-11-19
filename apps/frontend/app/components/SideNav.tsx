"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PlusCircleIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  BeakerIcon,
  ClipboardDocumentCheckIcon,
  CubeIcon,
  ClockIcon,
  CheckCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useAuth } from "../../lib/context/AuthContext";
import type { UserRole } from "@star-lab/shared";

interface MenuItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Define menu items for each role
const menuByRole: Record<UserRole, MenuItem[]> = {
  CUSTOMER: [
    { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
    { href: "/requests", label: "My Requests", icon: DocumentTextIcon },
    { href: "/requests/new", label: "New Request", icon: PlusCircleIcon },
    { href: "/invoices", label: "Invoices", icon: CurrencyDollarIcon },
    { href: "/profile", label: "Profile", icon: UserCircleIcon },
  ],
  TECHNICIAN: [
    { href: "/lab-dashboard", label: "Lab Dashboard", icon: HomeIcon },
    { href: "/lab-requests", label: "Test Requests", icon: BeakerIcon },
    { href: "/lab/my-tests", label: "My Assigned Tests", icon: ClipboardDocumentCheckIcon },
    { href: "/lab/samples", label: "Sample Tracking", icon: CubeIcon },
  ],
  DOCTOR: [
    { href: "/doctor/dashboard", label: "Dashboard", icon: HomeIcon },
    { href: "/doctor/pending-approvals", label: "Pending Approvals", icon: ClockIcon },
    { href: "/doctor/approved", label: "Approved", icon: CheckCircleIcon },
    { href: "/doctor/workload", label: "My Workload", icon: ChartBarIcon },
    { href: "/profile", label: "Profile", icon: UserCircleIcon },
  ],
  ADMIN: [
    { href: "/admin/admin-dashboard", label: "Dashboard", icon: HomeIcon },
    { href: "/users", label: "Users", icon: UsersIcon },
    { href: "/admin/requests", label: "All Requests", icon: DocumentTextIcon },
    { href: "/admin/invoices", label: "Invoices", icon: CurrencyDollarIcon },
    { href: "/admin/reports", label: "Reports", icon: ChartBarIcon },
    { href: "/admin/settings", label: "Settings", icon: Cog6ToothIcon },
  ],
  LAB_ADMIN: [
    { href: "/lab-dashboard", label: "Dashboard", icon: HomeIcon },
    { href: "/users", label: "Users", icon: UsersIcon },
    { href: "/admin/requests", label: "All Requests", icon: DocumentTextIcon },
    { href: "/admin/invoices", label: "Invoices", icon: CurrencyDollarIcon },
    { href: "/lab/requests", label: "Lab Operations", icon: BeakerIcon },
  ],
  APPROVAL: [
    { href: "/approval/dashboard", label: "Dashboard", icon: HomeIcon },
    { href: "/approval/pending-payment", label: "Pending Payment", icon: ClockIcon },
    { href: "/approval/invoices", label: "Invoices", icon: CurrencyDollarIcon },
  ],
};

export default function SideNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Get menu items based on user role, fallback to empty array if no role
  const links = user?.role ? menuByRole[user.role] : [];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={clsx(
          "fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden transition-opacity dark:bg-black/70",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={clsx(
          "fixed z-40 mt-16 h-[calc(100dvh-4rem)] w-72 overflow-y-auto border-r border-border bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:mt-20 md:h-[calc(100dvh-5rem)]",
          "transition-transform duration-200 ease-out md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <nav className="space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            // Check if current route is active
            const isActive = pathname === href || pathname?.startsWith(href + "/");

            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80 hover:bg-accent hover:text-foreground"
                )}
                onClick={onClose}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info card */}
        {user && (
          <div className="mt-6 rounded-lg border border-border bg-card p-4 text-sm">
            <p className="font-medium text-card-foreground">
              {user.email}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Role: {user.role}
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
