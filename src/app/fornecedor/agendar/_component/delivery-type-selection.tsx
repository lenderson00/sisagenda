"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DeliveryTypeSelectionProps {
  deliveryTypeSlug: string;
  name: string;
  description: string;
  organizationSlug: string;
  position: "top" | "middle" | "bottom";
  unique?: boolean;
}

export default function DeliveryTypeSelection({
  deliveryTypeSlug,
  name,
  description,
  organizationSlug,
  position,
  unique = false,
}: DeliveryTypeSelectionProps) {
  return (
    <Link href={`/agendar/${organizationSlug}/${deliveryTypeSlug}`}>
      <Card
        className={cn(
          "w-full",
          position === "top" && "rounded-b-none",
          position === "bottom" && "rounded-t-none border-t-0",
          position === "middle" && "rounded-none border-t-0",
          unique && "rounded-lg",
          "shadow-none hover:bg-muted cursor-pointer group duration-300 transition-all ease-in-out",
        )}
      >
        <CardHeader className="relative">
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <div className="flex items-center gap-2 absolute right-6 top-1/2 -translate-y-1/2">
            <IconChevronRight
              size={24}
              className="text-muted-foreground group-hover:text-primary"
            />
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
