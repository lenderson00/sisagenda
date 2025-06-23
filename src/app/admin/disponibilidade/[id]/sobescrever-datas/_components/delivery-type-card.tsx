"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DeliveryType } from "@prisma/client";

interface DeliveryTypeCardProps {
  deliveryType: DeliveryType;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function DeliveryTypeCard({
  deliveryType,
  isSelected,
  onSelect,
}: DeliveryTypeCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected && "border-primary ring-2 ring-primary",
      )}
      onClick={() => onSelect(deliveryType.id)}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{deliveryType.name}</span>
          <div
            className={cn(
              "h-5 w-5 rounded-full border-2 border-muted-foreground",
              isSelected && "border-primary bg-primary",
            )}
          />
        </CardTitle>
      </CardHeader>
      {deliveryType.description && (
        <CardContent>
          <CardDescription>{deliveryType.description}</CardDescription>
        </CardContent>
      )}
    </Card>
  );
}
