"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Appointment, DeliveryType, User } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertTriangle,
  Briefcase,
  Calendar,
  Clock,
  User as LucideUser,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { CancellationDialog } from "./cancellation-dialog";

interface AppointmentDetailsCardProps {
  appointment: Appointment & {
    deliveryType: DeliveryType;
    user: User;
  };
}

export function AppointmentDetailsCard({
  appointment,
}: AppointmentDetailsCardProps) {
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Detalhes do Agendamento</CardTitle>
            <Badge variant="outline" className="text-sm">
              {appointment.deliveryType.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {format(new Date(appointment.date), "PPP", { locale: ptBR })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{appointment.user.address || "Endereço não informado"}</span>
          </div>

          {/* {appointment.observations && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Observações
              </h4>
              <p className="text-sm text-gray-600">
                {appointment.observations as string}
              </p>
            </div>
          )} */}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl">
                {appointment.deliveryType.name}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  {format(new Date(appointment.date), "PPP", { locale: ptBR })}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2 text-gray-800">
              Informações do Cliente
            </h3>
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Data</p>
                  <p className="text-gray-600">
                    {format(new Date(appointment.date), "PPP", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Horário</p>
                  <p className="text-gray-600">
                    {format(new Date(appointment.date), "p", { locale: ptBR })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <LucideUser className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Cliente</p>
                  <p className="text-gray-600">{appointment.user.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Endereço</p>
                  <p className="text-gray-600">
                    {appointment.user.address || "Endereço não informado"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Tipo de Serviço</p>
                  <p className="text-gray-600">
                    {appointment.deliveryType.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
