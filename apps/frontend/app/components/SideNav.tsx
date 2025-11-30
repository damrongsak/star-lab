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
  FolderIcon,
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
    { href: "/projects", label: "Projects", icon: FolderIcon },
    { href: "/requests", label: "My Requests", icon: DocumentTextIcon },
    { href: "/requests/new", label: "New Request", icon: PlusCircleIcon },
    { href: "/invoices", label: "Invoices", icon: CurrencyDollarIcon },
  ],
  TECHNICIAN: [
    { href: "/lab/dashboard", label: "Lab Dashboard", icon: HomeIcon },
    { href: "/lab/requests", label: "Test Requests", icon: BeakerIcon },
    { href: "/lab/my-tests", label: "My Assigned Tests", icon: ClipboardDocumentCheckIcon },
    { href: "/lab/samples", label: "Sample Tracking", icon: CubeIcon },
  ],
  DOCTOR: [
    { href: "/doctor/dashboard", label: "Dashboard", icon: HomeIcon },
    { href: "/doctor/pending-approvals", label: "Pending Approvals", icon: ClockIcon },
    { href: "/doctor/approved", label: "Approved", icon: CheckCircleIcon },
    { href: "/doctor/workload", label: "My Workload", icon: ChartBarIcon },
  ],
  ADMIN: [
    { href: "/admin/dashboard", label: "Dashboard", icon: HomeIcon },
    { href: "/admin/users", label: "Users", icon: UsersIcon },
    { href: "/admin/customers", label: "Customers", icon: UsersIcon },
    { href: "/admin/requests", label: "All Requests", icon: DocumentTextIcon },
    { href: "/admin/invoices", label: "Invoices", icon: CurrencyDollarIcon },
    { href: "/approval/pending-payment", label: "Pending Payment", icon: ClockIcon },
    { href: "/admin/reports", label: "Reports", icon: ChartBarIcon },
    { href: "/admin/settings", label: "Settings", icon: Cog6ToothIcon },
    { href: "/lab/dashboard", label: "Lab Dashboard", icon: BeakerIcon },
    { href: "/doctor/dashboard", label: "Doctor Dashboard", icon: ClipboardDocumentCheckIcon },
  ],
  LAB_ADMIN: [
    { href: "/lab/dashboard", label: "Dashboard", icon: HomeIcon },
    { href: "/admin/users", label: "Users", icon: UsersIcon },
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

export default function SideNav({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Get menu items based on user role, fallback to empty array if no role
  const links = user?.role ? menuByRole[user.role] : [];

  return (
    <aside
      className="w-64 h-screen overflow-y-auto bg-background border-r border-border flex flex-col"
    >
      {/* Logo/Brand */}
      <div className="p-6 flex items-center gap-3">
        <div className="h-8 w-8 rounded bg-accent flex items-center justify-center">
          <span className="text-accent-foreground font-bold text-lg">S</span>
        </div>
        <span className="text-xl font-bold text-foreground tracking-tight">StarLab</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname?.startsWith(href + "/");

          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
              onClick={onClose}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
