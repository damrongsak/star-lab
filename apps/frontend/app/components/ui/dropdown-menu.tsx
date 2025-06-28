// --- app/components/ui/dropdown-menu.tsx ---
// Dropdown menu component (basic placeholder for Radix UI type)
import React, { forwardRef } from "react";
import type { RefObject, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface DropdownMenuProps {
  isOpen: boolean;
  children: ReactNode;
  position?: "left" | "right";
  className?: string;
}

const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ isOpen, children, position = "right", className }, ref) => {
    if (!isOpen) return null;

    const positionClasses = position === "right" ? "right-0" : "left-0";

    return (
      <div
        ref={ref}
        className={twMerge(
          `absolute mt-2 w-48 bg-light-bg-main dark:bg-dark-bg-secondary rounded-lg shadow-xl py-1 z-50 border border-light-border dark:border-dark-border`,
          positionClasses,
          className,
        )}
      >
        {children}
      </div>
    );
  },
);

export { DropdownMenu };
