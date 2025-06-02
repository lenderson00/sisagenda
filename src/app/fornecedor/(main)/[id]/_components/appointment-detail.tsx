"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Appointment, DeliveryType, User } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, User as LucideUser, MapPin } from "lucide-react";
import { useState } from "react";
import { CancellationDialog } from "./cancellation-dialog";

interface AppointmentDetailProps {
  appointment: Appointment & {
    deliveryType: DeliveryType;
    user: User;
  };
}

export function AppointmentDetail({ appointment }: AppointmentDetailProps) {
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">
                {appointment.deliveryType.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {format(new Date(appointment.date), "PPP", { locale: ptBR })}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {appointment.observations && (
            <div>
              <h3 className="font-semibold mb-2">Observações</h3>
              <p className="text-muted-foreground">
                {appointment.observations as string}
              </p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Data</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(appointment.date), "PPP", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Horário</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(appointment.date), "p", { locale: ptBR })}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Endereço</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.user.address || "Endereço não informado"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <LucideUser className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Cliente</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.user.name}
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
