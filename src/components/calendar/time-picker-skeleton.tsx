"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Skeleton } from "../ui/skeleton";

interface TimePickerSkeletonProps {
  className?: string;
}

export function TimePickerSkeleton({ className }: TimePickerSkeletonProps) {
  return (
    <div className={cn("h-full bg-background flex flex-col", className)}>
      {/* Scrollable Content Skeleton */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {/* Time slots skeleton */}
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton
            key={`key-skeleton-index-${index}`}
            className="w-full h-6 rounded-md"
          />
        ))}
      </div>
    </div>
  );
}
