"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Appointment, DeliveryType, User } from "@prisma/client";
import {
  Briefcase,
  Calendar,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RotateCcw,
  User as UserIcon,
  X,
} from "lucide-react";
import { useState } from "react";
import { CancellationDialog } from "./cancellation-dialog";
import { RescheduleDialog } from "./reschedule-dialog";

interface AppointmentFormDetailsSidebarProps {
  appointment: Appointment & {
    deliveryType: DeliveryType;
    user: User;
  };
}

export function AppointmentFormDetailsSidebar({
  appointment,
}: AppointmentFormDetailsSidebarProps) {
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);

  return (
    <div className="space-y-6">
      {/* Action Cards */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            Ações Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            Você pode realizar as seguintes ações neste agendamento:
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">Comentários</p>
                <p className="text-xs text-blue-700">
                  Adicione comentários na seção de atividades abaixo
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowRescheduleDialog(true)}
              variant="outline"
              className="w-full justify-start gap-3 h-auto p-3 border-orange-200 hover:bg-orange-50"
            >
              <RotateCcw className="h-4 w-4 text-orange-600" />
              <div className="text-left">
                <p className="text-sm font-medium text-orange-900">
                  Solicitar Reagendamento
                </p>
                <p className="text-xs text-orange-700">
                  Propor nova data para este agendamento
                </p>
              </div>
            </Button>

            <Button
              onClick={() => setShowCancellationDialog(true)}
              variant="outline"
              className="w-full justify-start gap-3 h-auto p-3 border-red-200 hover:bg-red-50"
            >
              <X className="h-4 w-4 text-red-600" />
              <div className="text-left">
                <p className="text-sm font-medium text-red-900">
                  Solicitar Cancelamento
                </p>
                <p className="text-xs text-red-700">
                  Cancelar este agendamento
                </p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-gray-600" />
            Informações do Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <UserIcon className="h-4 w-4 text-gray-500 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-900">Nome</p>
              <p className="text-sm text-gray-600">{appointment.user.name}</p>
            </div>
          </div>

          {appointment.user.email && (
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-gray-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">
                  {appointment.user.email}
                </p>
              </div>
            </div>
          )}

          {appointment.user.whatsapp && (
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-gray-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Telefone</p>
                <p className="text-sm text-gray-600">
                  {appointment.user.whatsapp}
                </p>
              </div>
            </div>
          )}

          {appointment.user.address && (
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-gray-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Endereço</p>
                <p className="text-sm text-gray-600">
                  {appointment.user.address}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-gray-600" />
            Detalhes do Serviço
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Briefcase className="h-4 w-4 text-gray-500 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Tipo de Serviço
              </p>
              <p className="text-sm text-gray-600">
                {appointment.deliveryType.name}
              </p>
            </div>
          </div>

          {appointment.deliveryType.description && (
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-gray-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900">Descrição</p>
                <p className="text-sm text-gray-600">
                  {appointment.deliveryType.description}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-gray-500 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Ordem de Compra
              </p>
              <p className="text-sm text-gray-600 font-mono">
                {appointment.ordemDeCompra}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CancellationDialog
        appointmentId={appointment.id}
        open={showCancellationDialog}
        onOpenChange={setShowCancellationDialog}
      />

      <RescheduleDialog
        appointmentId={appointment.id}
        currentDate={appointment.date}
        open={showRescheduleDialog}
        onOpenChange={setShowRescheduleDialog}
      />
    </div>
  );
}
