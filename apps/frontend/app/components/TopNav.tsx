"use client";

import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

export default function TopNav({ onMenu }: { onMenu: () => void }) {
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
          <div className="ml-1 h-9 w-9 overflow-hidden rounded-full ring-1 ring-border">
            <Image alt="Avatar" src="/avatar.png" width={36} height={36} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}

