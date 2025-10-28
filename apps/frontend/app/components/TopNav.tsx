"use client";

import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

export default function TopNav({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/30 border-b border-black/5 dark:border-white/10">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:h-20">
        <button
          className="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md md:hidden hover:bg-black/5 dark:hover:bg-white/10"
          aria-label="Open menu"
          onClick={onMenu}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        <Logo />

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="relative hidden sm:block">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/60" />
            <input
              className="h-10 w-64 rounded-md border border-black/10 bg-white/90 pl-10 pr-3 text-sm outline-none placeholder:text-foreground/50 focus:ring-2 focus:ring-black/10 dark:border-white/10 dark:bg-black/40 dark:focus:ring-white/10"
              placeholder="Search…"
            />
          </div>
          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/10">
            <BellIcon className="h-6 w-6" />
            <span className="sr-only">Notifications</span>
          </button>
          <ThemeToggle />
          <div className="ml-1 h-9 w-9 overflow-hidden rounded-full ring-1 ring-black/10 dark:ring-white/10">
            <Image alt="Avatar" src="/avatar.png" width={36} height={36} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}

