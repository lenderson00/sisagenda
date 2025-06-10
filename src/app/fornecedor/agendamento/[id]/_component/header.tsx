import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type {
  Appointment,
  DeliveryType,
  User as PrismaUser,
} from "@prisma/client";
import dayjs from "dayjs";
import {
  AlertTriangle,
  Calendar,
  Clock,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react";

interface AppointmentHeaderProps {
  appointment: any;
  onStatusChange?: (status: string) => void;
}

export const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({
  appointment,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "confirmed":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "out_for_appointment":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
      case "cancelled":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case "scheduled":
        return 20;
      case "confirmed":
        return 40;
      case "out_for_appointment":
        return 70;
      case "delivered":
        return 100;
      case "failed":
        return 100;
      case "cancelled":
        return 100;
      default:
        return 0;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      urgent: "bg-red-500 text-white animate-pulse",
      high: "bg-orange-500 text-white",
      medium: "bg-yellow-500 text-white",
      low: "bg-green-500 text-white",
    };

    const labels = {
      urgent: "🚨 URGENTE",
      high: "⚡ ALTA",
      medium: "📋 MÉDIA",
      low: "📝 BAIXA",
    };

    return (
      <Badge className={colors[priority as keyof typeof colors]}>
        {labels[priority as keyof typeof labels]}
      </Badge>
    );
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      scheduled: "Agendado",
      confirmed: "Confirmado",
      out_for_appointment: "Em rota de entrega",
      delivered: "Entregue com sucesso",
      failed: "Falha na entrega",
      cancelled: "Cancelado",
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  return (
    <div className="bg-white rounded-xl border  overflow-hidden">
      {/* Header principal com status */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-lg p-3 ">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Agendamento #{appointment.internalId}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Criado em{" "}
                {new Date(appointment.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge
              className={`text-sm font-medium ${getStatusColor(appointment.status)}`}
            >
              {getStatusText(appointment.status)}
            </Badge>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>Progresso da entrega</span>
            <span>{getStatusProgress(appointment.status)}%</span>
          </div>
          <Progress
            value={getStatusProgress(appointment.status)}
            className="h-2"
          />
        </div>

        {/* Tipo de entrega destacado */}
        <div className="bg-white rounded-lg p-3 border border-blue-100">
          <div className="flex items-center space-x-2">
            <Truck className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-gray-900">
              {appointment.deliveryType.name}
            </span>
          </div>
        </div>
      </div>

      {/* Informações detalhadas */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações do cliente */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <User className="w-4 h-4 mr-2 text-gray-500" />
              Informações do Cliente
            </h3>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">
                  {appointment.user.name}
                </span>
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-1" />
                  Ligar
                </Button>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3 h-3" />
                  <span>{appointment.user.whatsapp}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-3 h-3 mt-0.5" />
                  <div>
                    <div>{appointment.user.address}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informações da entrega */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              Detalhes da Entrega
            </h3>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Data agendada</span>
                  <div className="font-medium text-gray-900">
                    {dayjs(appointment.date).format("DD/MM/YYYY")}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Horário</span>
                  <div className="font-medium text-gray-900">
                    {dayjs(appointment.date).format("HH:mm")}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Duração estimada</span>
                  <div className="font-medium text-gray-900 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {appointment.duration} min
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
