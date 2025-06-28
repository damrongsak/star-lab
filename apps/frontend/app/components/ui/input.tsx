// --- app/components/ui/input.tsx ---
import React from "react";
import type { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  // Add custom props here if needed
}

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={twMerge(
        "w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-base text-gray-800 placeholder:text-gray-400",
        className,
      )}
      {...props}
    />
  );
};

export { Input };
