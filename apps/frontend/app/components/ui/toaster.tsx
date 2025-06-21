import React from "react";
import { useToast } from "./use-toast";
import { X } from "lucide-react";

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed z-50 top-4 right-4 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg shadow-lg px-4 py-3 bg-background border flex items-start gap-3 min-w-[260px] max-w-xs
            ${
              toast.variant === "destructive"
                ? "border-destructive bg-destructive/10 text-destructive"
                : ""
            }
            ${
              toast.variant === "success"
                ? "border-green-500 bg-green-50 text-green-900"
                : ""
            }
          `}
        >
          <div className="flex-1">
            <div className="font-semibold">{toast.title}</div>
            {toast.description && (
              <div className="text-sm text-muted-foreground">
                {toast.description}
              </div>
            )}
          </div>
          <button
            className="ml-2 p-1 rounded hover:bg-muted"
            onClick={() => removeToast(toast.id)}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
