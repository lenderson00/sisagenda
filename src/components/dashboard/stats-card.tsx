import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  unit?: string;
  icon: LucideIcon;
  description?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  unit,
  icon: Icon,
  description,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-center">
        <div className="mr-4 rounded-lg bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <div className="text-2xl font-bold">
            {value.toLocaleString()}
            {unit}
          </div>
        </div>
      </div>
    </Card>
  );
}
