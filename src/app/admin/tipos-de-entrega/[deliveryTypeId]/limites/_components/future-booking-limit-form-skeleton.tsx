import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function FutureBookingLimitFormSkeleton() {
  return (
    <Card className="w-full pb-0 gap-0 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2 w-full">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </CardHeader>
      <div className="p-6 pt-0">
        <div className="relative flex items-center gap-6 justify-between opacity-50 pointer-events-none">
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1">
              <Skeleton className="h-10 w-full" />
              <div className="h-5">
                <Skeleton className="h-4 w-24 mt-1" />
              </div>
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </div>
      <CardContent className="flex justify-between items-center bg-neutral-100 h-14 mt-2 border-t">
        <Skeleton className="h-4 w-2/5" />
        <div className="flex justify-end">
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
