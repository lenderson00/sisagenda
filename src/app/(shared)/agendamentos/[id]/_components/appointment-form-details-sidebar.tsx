"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Appointment, DeliveryType, User } from "@prisma/client";
import {
  Briefcase,
  Calendar,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Paperclip,
  Phone,
  RotateCcw,
  User as UserIcon,
  X,
} from "lucide-react";
import { useState } from "react";
import { CancellationDialog } from "./cancellation-dialog";
import { RescheduleDialog } from "./reschedule-dialog";
import type { AppointmentWithRelations } from "../types/app";

interface AppointmentFormDetailsSidebarProps {
  appointment: AppointmentWithRelations;
}

export function AppointmentFormDetailsSidebar({
  appointment,
}: AppointmentFormDetailsSidebarProps) {
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);

  return (
    <div className="space-y-6 sticky top-20">
      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-muted-foreground" />
            Informações do Fornecedor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <UserIcon className="h-4 w-4 text-muted-foreground mt-1" />
            <div>
              <p className="text-sm font-medium text-foreground">Nome</p>
              <p className="text-sm text-muted-foreground">
                {appointment.user.name}
              </p>
            </div>
          </div>

          {appointment.user.email && (
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium text-foreground">Email</p>
                <p className="text-sm text-muted-foreground">
                  {appointment.user.email}
                </p>
              </div>
            </div>
          )}

          {appointment.user.whatsapp && (
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium text-foreground">Telefone</p>
                <p className="text-sm text-muted-foreground">
                  {appointment.user.whatsapp}
                </p>
              </div>
            </div>
          )}

          {appointment.user.address && (
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium text-foreground">Endereço</p>
                <p className="text-sm text-muted-foreground">
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
            <Briefcase className="h-5 w-5 text-muted-foreground" />
            Detalhes do Serviço
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Briefcase className="h-4 w-4 text-muted-foreground mt-1" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Tipo de Serviço
              </p>
              <p className="text-sm text-muted-foreground">
                {appointment.deliveryType.name}
              </p>
            </div>
          </div>

          {appointment.deliveryType.description && (
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium text-foreground">Descrição</p>
                <p className="text-sm text-muted-foreground">
                  {appointment.deliveryType.description}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Ordem de Compra
              </p>
              <p className="text-sm text-muted-foreground font-mono">
                {appointment.ordemDeCompra}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Paperclip className="h-5 w-5 text-muted-foreground" />
            Anexos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointment.attachments.length > 0 ? (
            <div className="space-y-2">
              {appointment.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                >
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <a
                      href={attachment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline font-medium truncate block"
                    >
                      {attachment.fileName}
                    </a>
                    <p className="text-xs text-muted-foreground">
                      {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhum anexo enviado.
            </p>
          )}
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
