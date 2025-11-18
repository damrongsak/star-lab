"use client";

import { Bars3Icon, BellIcon, MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/lib/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function TopNav({ onMenu }: { onMenu: () => void }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:h-20">
        <button
          className="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-accent md:hidden"
          aria-label="Open menu"
          onClick={onMenu}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        <Logo />

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="relative hidden sm:block">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              className="h-10 w-64 rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
              placeholder="Search…"
            />
          </div>
          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-accent">
            <BellIcon className="h-6 w-6" />
            <span className="sr-only">Notifications</span>
          </button>
          <ThemeToggle />

          {/* User Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-accent ring-1 ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <UserCircleIcon className="h-8 w-8 text-muted-foreground" />
                <span className="sr-only">User menu</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.email || "Guest"}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase() || "No role"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} variant="destructive" className="cursor-pointer">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

