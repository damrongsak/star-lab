import React from "react";
import type { ReactNode } from "react";
import type { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400",
    secondary: "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-100 focus:ring-gray-200",
  };

  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2 text-base",
    lg: "h-12 px-6 py-3 text-lg",
  };

  return (
    <button
      className={twMerge(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

function buttonVariants({ variant = 'primary', size = 'md' }: { variant?: "primary" | "secondary" | "danger" | "ghost" | "outline"; size?: "sm" | "md" | "lg" } = {}) {
    const baseClasses =
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variantClasses = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400',
        secondary:
            'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-400',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400',
        ghost: 'bg-transparent text-gray-500 hover:bg-gray-100 focus:ring-gray-200',
        outline:
            'bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-100 focus:ring-gray-200',
    };
    const sizeClasses = {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 py-2 text-base',
        lg: 'h-12 px-6 py-3 text-lg',
    };
    return [
        baseClasses,
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
    ].join(' ');
}
export { Button, buttonVariants };
