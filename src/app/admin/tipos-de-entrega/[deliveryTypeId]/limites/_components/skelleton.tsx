import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonForm() {
  return (
    <Card className="w-full pb-0 gap-0 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </CardHeader>
      <div className="p-6 pt-0">
        <Skeleton className="h-[76px] w-full" />
      </div>
      <CardContent className="flex justify-between items-center bg-neutral-100 h-14 mt-2 border-t">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-8 w-20" />
      </CardContent>
    </Card>
  );
}
