"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, Circle } from "lucide-react";

export interface TimelineItem {
  title: string;
  description?: string;
  date?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  isDone?: boolean;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {items.map((item, index) => (
        <div key={index} className="relative flex gap-6">
          {/* Date - Left Side */}
          <div className="w-28 text-right">
            {item.date && (
              <span className="text-sm text-muted-foreground">{item.date}</span>
            )}
          </div>
          
          {/* Icon with connecting line */}
          <div className="relative flex flex-col items-center">
            <div
              className={cn(
                "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2",
                item.isDone && "border-primary bg-primary text-primary-foreground",
                item.isActive && !item.isDone && "border-primary bg-primary text-primary-foreground",
                !item.isDone && !item.isActive && "border-muted-foreground/30 bg-muted"
              )}
            >
              {item.icon || (
                item.isDone || item.isActive ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Circle className="h-3 w-3 fill-current text-muted-foreground/30" />
                )
              )}
            </div>
            {index < items.length - 1 && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 h-full w-px bg-border" />
            )}
          </div>
          
          {/* Content - Right Side */}
          <div className="flex-1 pb-8">
            <h4
              className={cn(
                "font-semibold text-base",
                (item.isActive || item.isDone) && "text-foreground",
                !item.isActive && !item.isDone && "text-muted-foreground"
              )}
            >
              {item.title}
            </h4>
            {item.description && (
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
