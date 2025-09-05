"use client";

import { useState } from "react";
import SideNav from "./SideNav";
import TopNav from "./TopNav";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <TopNav onMenu={() => setOpen((v) => !v)} />
      <div className="flex">
        <SideNav open={open} onClose={() => setOpen(false)} />
        <main className="w-full px-4 pb-8 pt-20 md:pl-72 md:pt-24">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

