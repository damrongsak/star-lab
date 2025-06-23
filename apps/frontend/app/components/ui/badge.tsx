// --- app/components/ui/badge.tsx ---
// Badge/label component (for status)
import React from "react";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, className }) => {
  return (
    <span
      className={twMerge(
        "px-3 py-1 text-xs font-semibold rounded-full",
        className,
      )}
    >
      {children}
    </span>
  );
};

export { Badge };
