import type { AppointmentWithRelations } from "@/app/fornecedor/(main)/page";
import type { User } from "@prisma/client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    PENDING_CONFIRMATION: "bg-yellow-500",
    CONFIRMED: "bg-green-500",
    REJECTED: "bg-red-500",
    CANCELLATION_REQUESTED: "bg-orange-500",
    CANCELLATION_REJECTED: "bg-red-600",
    CANCELLED: "bg-gray-500",
    RESCHEDULE_REQUESTED: "bg-purple-500",
    RESCHEDULE_CONFIRMED: "bg-blue-500",
    RESCHEDULE_REJECTED: "bg-red-400",
    RESCHEDULED: "bg-indigo-500",
    COMPLETED: "bg-green-600",
    SUPPLIER_NO_SHOW: "bg-red-700"
  };

  return statusColors[status] || "bg-gray-300";
};

const getStatusReadableName = (status: string) => {
  const statusNames: Record<string, string> = {
    PENDING_CONFIRMATION: "Pendente de Confirmação",
    CONFIRMED: "Confirmado",
    REJECTED: "Rejeitado",
    CANCELLATION_REQUESTED: "Pedido de Cancelamento",
    CANCELLATION_REJECTED: "Pedido de Cancelamento Rejeitado",
    CANCELLED: "Cancelado",
    RESCHEDULE_REQUESTED: "Reagendamento Solicitado",
    RESCHEDULE_CONFIRMED: "Reagendamento Confirmado",
    RESCHEDULE_REJECTED: "Reagendamento Rejeitado",
    RESCHEDULED: "Reagendado",
    COMPLETED: "Concluído",
    SUPPLIER_NO_SHOW: "Fornecedor Não Compareceu"
  };

  return statusNames[status] || status;
};

export function exportAppointmentsToPDF(
  appointments: AppointmentWithRelations[],
  user: User,
) {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;

  // Header
  doc.text(`Agendamentos - ${user.name}`, 14, 16);

  const tableColumn = [
    "Ordem de Compra",
    "OM",
    "Tipo de Entrega",
    "Data Agendada",
    "Status",
  ];

  const tableRows: any[][] = [];

  for (const appointment of appointments) {
    const appointmentData = [
      appointment.ordemDeCompra,
      appointment.organization?.name,
      appointment.deliveryType.name,
      new Date(appointment.date).toLocaleDateString(),
      getStatusReadableName(appointment.status),
    ];
    tableRows.push(appointmentData);
  }

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
    didDrawPage: (data) => {
      // Footer
      const currentDate = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      doc.setFontSize(8);
      doc.setTextColor(100);

      // Date
      doc.text(
        `Relatório gerado em: ${currentDate}`,
        data.settings.margin.left,
        pageHeight - 20
      );

      // App signature
      doc.text(
        'SISAgenda - Sistema de Agendamentos',
        data.settings.margin.left,
        pageHeight - 15
      );

      // Page number
      doc.text(
        `Página ${data.pageNumber}`,
        data.settings.margin.left,
        pageHeight - 10
      );
    }
  });

  doc.save("agendamentos.pdf");
}
