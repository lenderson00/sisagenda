import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function WhatsappFormSkeleton() {
  return (
    <Card className="w-full pb-0 gap-0 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardHeader>
      <div className="p-6 pt-0">
        <div className="flex items-end gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
      <CardContent className="flex justify-between items-center bg-neutral-100 h-14 border-t px-6">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-8 w-24" />
      </CardContent>
    </Card>
  );
}
