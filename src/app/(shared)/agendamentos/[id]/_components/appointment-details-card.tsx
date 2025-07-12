"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Briefcase,
  Calendar,
  Clock,
  FileText,
  User as LucideUser,
  MapPin,
  Package,
  Receipt,
  TestTube,
  Truck,
} from "lucide-react";
import { useState } from "react";
import type { AppointmentWithRelationsAndStringPrice } from "../types/app";
import { AppointmentItemsDialog } from "./appointment-items-dialog";
import { CancellationDialog } from "./cancellation-dialog";

interface AppointmentDetailsCardProps {
  appointment: AppointmentWithRelationsAndStringPrice;
}

export function AppointmentDetailsCard({
  appointment,
}: AppointmentDetailsCardProps) {
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);
  const [showItemsDialog, setShowItemsDialog] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">
                Agendamento #{appointment.internalId}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {appointment.deliveryType.name}
                </Badge>
                <Badge
                  variant={
                    appointment.status === "CONFIRMED" ? "default" : "secondary"
                  }
                >
                  {appointment.status === "CONFIRMED"
                    ? "Confirmado"
                    : "Pendente"}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Informações Básicas
            </h3>
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Data</p>
                  <p className="text-muted-foreground">
                    {format(new Date(appointment.date), "PPP", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Horário</p>
                  <p className="text-muted-foreground">
                    {format(new Date(appointment.date), "p", { locale: ptBR })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <LucideUser className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Cliente</p>
                  <p className="text-muted-foreground">
                    {appointment.creator?.name ?? "Não identificado"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Endereço</p>
                  <p className="text-muted-foreground">
                    {(appointment.creator as any)?.address ||
                      "Endereço não informado"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Tipo de Serviço</p>
                  <p className="text-muted-foreground">
                    {appointment.deliveryType.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Receipt className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Ordem de Compra</p>
                  <p className="text-muted-foreground font-mono">
                    {appointment.ordemDeCompra}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Delivery Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Detalhes da Entrega
            </h3>
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              {appointment.notaFiscal && (
                <div className="flex items-start gap-3">
                  <Receipt className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Nota Fiscal</p>
                    <p className="text-muted-foreground">
                      {appointment.notaFiscal}
                    </p>
                  </div>
                </div>
              )}

              {appointment.processNumber && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">
                      Número do Processo
                    </p>
                    <p className="text-muted-foreground">
                      {appointment.processNumber}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">
                    Primeira Entrega
                  </p>
                  <Badge
                    variant={
                      appointment.isFirstDelivery ? "default" : "secondary"
                    }
                  >
                    {appointment.isFirstDelivery ? "Sim" : "Não"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TestTube className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">
                    Análise Laboratorial
                  </p>
                  <Badge
                    variant={
                      appointment.needsLabAnalysis ? "default" : "secondary"
                    }
                  >
                    {appointment.needsLabAnalysis
                      ? "Necessária"
                      : "Não Necessária"}
                  </Badge>
                </div>
              </div>
            </div>

            {appointment.observation && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="font-medium text-foreground mb-2">Observações</p>
                <p className="text-muted-foreground text-sm">
                  {appointment.observation}
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => setShowItemsDialog(true)}
            disabled={appointment.items.length === 0}
          >
            <Package className="mr-2 h-4 w-4" />
            Ver Itens ({appointment.items.length})
          </Button>
        </CardFooter>
      </Card>

      <AppointmentItemsDialog
        items={appointment.items}
        open={showItemsDialog}
        onOpenChange={setShowItemsDialog}
      />

      <CancellationDialog
        appointmentId={appointment.id}
        open={showCancellationDialog}
        onOpenChange={setShowCancellationDialog}
      />
    </>
  );
}
