"use client";

import Link from "next/link";
import { HomeIcon, Cog6ToothIcon, ChartBarIcon, RectangleStackIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

const links = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/projects", label: "Projects", icon: RectangleStackIcon },
  { href: "/analytics", label: "Analytics", icon: ChartBarIcon },
  { href: "/settings", label: "Settings", icon: Cog6ToothIcon },
];

export default function SideNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={clsx(
          "fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={clsx(
          "fixed z-40 mt-16 h-[calc(100dvh-4rem)] w-72 overflow-y-auto border-r border-black/5 bg-white/70 p-4 backdrop-blur dark:border-white/10 dark:bg-black/30 md:mt-20 md:h-[calc(100dvh-5rem)]",
          "transition-transform duration-200 ease-out md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <nav className="space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/90 hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
              onClick={onClose}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-6 rounded-lg border border-black/10 p-4 text-sm dark:border-white/10">
          <p className="font-medium">Upgrade to Pro</p>
          <p className="mt-1 text-foreground/70">Unlock advanced analytics and collaboration.</p>
          <button className="mt-3 inline-flex rounded-md bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90">Upgrade</button>
        </div>
      </aside>
    </>
  );
}

