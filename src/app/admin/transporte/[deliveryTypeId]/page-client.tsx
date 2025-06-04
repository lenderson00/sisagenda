"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Availability } from "./_components/availability";
import { AvailabilityRule } from "./_components/availability-rule";

export function DeliveryTypePageClient() {
  return <Availability />;
}
