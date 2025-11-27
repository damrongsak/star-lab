"use client";

import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { useAuth } from "@/lib/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TopNav({ onMenu }: { onMenu: () => void }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto flex h-16 items-center gap-4 px-6">
        <Button
          variant="ghost"
          size="icon"
          className="-ml-2 md:hidden text-muted-foreground hover:text-foreground"
          aria-label="Open menu"
          onClick={onMenu}
        >
          <Bars3Icon className="h-6 w-6" />
        </Button>

        {/* Global Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative group">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <input
              className="h-10 w-full rounded-full border border-border bg-secondary/30 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-accent/50 focus:bg-secondary/50 focus:ring-2 focus:ring-accent/20"
              placeholder="Search for requests, invoices..."
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent ring-2 ring-background"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="ml-1 pl-2 pr-1 py-1 h-auto rounded-full hover:bg-secondary/50 gap-2 border border-transparent hover:border-border transition-all">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-accent/20">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="hidden md:flex flex-col items-start text-xs mr-2">
                  <span className="font-medium text-foreground">{user?.email?.split('@')[0]}</span>
                  <span className="text-muted-foreground capitalize text-[10px]">{user?.role?.toLowerCase()}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem asChild className="focus:bg-accent/10 focus:text-accent cursor-pointer">
                <Link href="/profile">
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

