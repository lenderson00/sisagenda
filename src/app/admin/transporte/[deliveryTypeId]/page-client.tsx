"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Availability } from "./_components/availability";
import { AvailabilityRule } from "./_components/availability-rule";

interface DeliveryType {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  organization: string;
}

interface DeliveryTypePageClientProps {
  deliveryType: DeliveryType;
}

export function DeliveryTypePageClient({
  deliveryType,
}: DeliveryTypePageClientProps) {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid gap-3 md:grid-cols-3">
        {/** Create Availability */}
        <div className=" rounded text-slate-400 col-span-2">
          <Availability />
        </div>
        {/** Create Availability Rules */}
        <div className="border rounded p-8 bg-white  text-slate-400">
          <AvailabilityRule />
        </div>
      </div>
    </div>
  );
}
