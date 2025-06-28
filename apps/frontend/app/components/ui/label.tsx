// --- app/components/ui/label.tsx ---
// Label for form fields (basic placeholder)
import React from "react";
import type { LabelHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

const Label: React.FC<LabelProps> = ({ children, className, ...props }) => {
  return (
    <label
      className={twMerge(
        "block text-sm font-medium mb-1 text-light-text-main dark:text-dark-text-main",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
};

export { Label };
