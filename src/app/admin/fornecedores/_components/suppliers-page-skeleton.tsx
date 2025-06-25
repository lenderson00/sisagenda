"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SuppliersPageSkeleton() {
  return (
    <div className="container mx-auto pt-2">
      {/* Skeleton for Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="bg-background p-4">
            <div className="flex items-center">
              <Skeleton className="h-6 w-6 mr-4 rounded-lg" />
              <div>
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-8 w-12" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Skeleton for Data Table */}
      <div className="w-full">
        {/* Filter bar skeleton */}
        <div className="flex items-center pb-4 gap-2">
          <Skeleton className="h-8 w-24" />
        </div>

        {/* Table skeleton */}
        <Card className="bg-background p-0">
          <div className="p-4 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-8 flex-grow" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
