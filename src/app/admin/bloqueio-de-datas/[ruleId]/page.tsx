"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { minutesToTime } from "../_components/utils";
import { useQuery } from "@tanstack/react-query";
import type { AvailabilityRule, DeliveryType } from "@prisma/client";
import dayjs from "dayjs";
import { ArrowLeft, Calendar, Clock, Edit, Truck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type {
  AvailabilityExceptionRule,
  DateSpecificBlock,
} from "../_components/types";

export default function RuleDetailsPage() {
  const params = useParams();
  const ruleIndex = Number(params.ruleId);

  const { data: availabilityRule, isLoading: isLoadingRule } = useQuery<
    (AvailabilityRule & { deliveryTypes: { id: string }[] }) | null
  >({
    queryKey: ["availability-rule"],
    queryFn: async () => {
      const response = await fetch("/api/rules");
      if (!response.ok) throw new Error("Failed to fetch rules");
      const result = await response.json();
      return result?.[0] || null;
    },
  });

  const { data: deliveryTypes, isLoading: isLoadingDeliveryTypes } = useQuery<
    DeliveryType[]
  >({
    queryKey: ["delivery-types"],
    queryFn: async () => {
      const response = await fetch("/api/delivery-types");
      if (!response.ok) throw new Error("Failed to fetch delivery types");
      return response.json();
    },
  });

  const isLoading = isLoadingRule || isLoadingDeliveryTypes;

  if (isLoading) {
    return (
      <div className="p-6">
        <div>Carregando detalhes da regra...</div>
      </div>
    );
  }

  const rules = availabilityRule?.rule
    ? (availabilityRule.rule as unknown as AvailabilityExceptionRule[])
    : [];

  const rule = rules[ruleIndex];

  if (!rule) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Regra não encontrada</h1>
        <p>A regra que você está procurando não existe ou foi removida.</p>
        <Button asChild className="mt-4">
          <Link href="/bloqueio-de-datas">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a lista
          </Link>
        </Button>
      </div>
    );
  }

  const ruleDeliveryTypeIds =
    availabilityRule?.deliveryTypes.map((dt) => dt.id) || [];

  const associatedDeliveryTypes =
    deliveryTypes?.filter((dt) => ruleDeliveryTypeIds.includes(dt.id)) || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Detalhes da Regra de Bloqueio</h1>
          <p className="text-muted-foreground">
            Visualize as informações da regra selecionada.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/bloqueio-de-datas">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/bloqueio-de-datas/editar/${ruleIndex}`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Períodos Bloqueados</CardTitle>
              <CardDescription>
                Datas e horários em que o bloqueio se aplica.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {rule.dates.map((d: DateSpecificBlock, i: number) => (
                  <li key={i} className="flex items-center gap-4">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-semibold">
                        {dayjs(d.date).format("DD/MM/YYYY")}
                      </p>
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {minutesToTime(d.startTime)} -{" "}
                        {minutesToTime(d.endTime)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Justificativa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="italic text-muted-foreground">{rule.comment}</p>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Transportes Afetados</CardTitle>
              <CardDescription>
                Esta regra se aplica aos seguintes tipos de transporte.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {associatedDeliveryTypes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {associatedDeliveryTypes.map((dt) => (
                    <Badge key={dt.id} variant="secondary">
                      <Truck className="mr-2 h-4 w-4" />
                      {dt.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Esta regra se aplica a todos os transportes.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
