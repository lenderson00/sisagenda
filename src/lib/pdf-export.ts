import type { AppointmentWithRelations } from "@/app/fornecedor/(main)/page";
import dayjs from "@/lib/dayjs";
import type { User } from "@prisma/client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getStatusColor, getStatusReadableName } from "./utils";



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
  const statusColors: string[] = [];

  for (const appointment of appointments) {
    const appointmentData = [
      appointment.ordemDeCompra,
      appointment.organization?.name,
      appointment.deliveryType.name,
      dayjs(appointment.date).format("DD/MM/YYYY HH:mm"),
      getStatusReadableName(appointment.status),
    ];
    tableRows.push(appointmentData);

    // Map status colors to PDF colors
    const statusColor = getStatusColor(appointment.status);
    const pdfColor = statusColor.replace('bg-', '').replace('-', '');
    statusColors.push(pdfColor);
  }

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
    didDrawCell: (data) => {
      // Apply color to status column (index 4)
      if (data.column.index === 4 && data.row.index > 0) {
        const statusColor = statusColors[data.row.index - 1];
        data.cell.styles.fillColor = statusColor;
        data.cell.styles.textColor = '#FFFFFF';
      }
    },
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
