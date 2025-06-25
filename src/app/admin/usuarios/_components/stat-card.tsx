import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconBgClassName?: string;
  iconClassName?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconBgClassName,
  iconClassName,
}: StatCardProps) {
  return (
    <Card className="bg-background p-4">
      <div className="flex items-center ">
        <div className={cn("p-0 mr-4 rounded-lg", iconBgClassName)}>
          <Icon className={cn("h-6 w-6", iconClassName)} />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}
